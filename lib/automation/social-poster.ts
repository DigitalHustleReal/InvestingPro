/**
 * Social Media Posting Automation
 * Auto-posts articles to Twitter/X and LinkedIn.
 *
 * Twitter API v2 free tier: 1,500 tweets/month
 *   - Requires OAuth 1.0a User Context (API Key + Access Token)
 *   - Endpoint: POST https://api.twitter.com/2/tweets
 *
 * LinkedIn API:
 *   - Requires OAuth 2.0 access token + organization URN
 *   - Endpoint: POST https://api.linkedin.com/v2/ugcPosts
 *
 * Env vars required:
 *   TWITTER_API_KEY, TWITTER_API_SECRET,
 *   TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET
 *   LINKEDIN_ACCESS_TOKEN, LINKEDIN_ORGANIZATION_ID
 */

import { createHmac, randomBytes } from "crypto";
import { logger } from "@/lib/logger";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SocialPostParams {
  articleId: string;
  title: string;
  excerpt: string;
  url: string;
  category: string;
}

export interface SocialPostResult {
  twitter: boolean;
  linkedin: boolean;
  success: boolean;
  tweetId?: string;
  linkedinPostId?: string;
  error?: string;
}

// ─── Main entry point ────────────────────────────────────────────────────────

/**
 * Post article to social media platforms.
 * Each platform is independent — one failing won't block the other.
 */
export async function postToSocialMedia(
  params: SocialPostParams,
): Promise<SocialPostResult> {
  const result: SocialPostResult = {
    twitter: false,
    linkedin: false,
    success: false,
  };

  try {
    const twitterText = generateTwitterPost(params);
    const linkedinText = generateLinkedInPost(params);

    // Post to both platforms concurrently
    const [twitterResult, linkedinResult] = await Promise.allSettled([
      postToTwitter(twitterText),
      postToLinkedIn(linkedinText, params),
    ]);

    if (twitterResult.status === "fulfilled" && twitterResult.value.posted) {
      result.twitter = true;
      result.tweetId = twitterResult.value.id;
    }

    if (linkedinResult.status === "fulfilled" && linkedinResult.value.posted) {
      result.linkedin = true;
      result.linkedinPostId = linkedinResult.value.id;
    }

    result.success = result.twitter || result.linkedin;

    if (!result.success) {
      const errors: string[] = [];
      if (twitterResult.status === "rejected")
        errors.push(`Twitter: ${twitterResult.reason}`);
      else if (!twitterResult.value.posted)
        errors.push(
          `Twitter: ${twitterResult.value.error || "not configured"}`,
        );
      if (linkedinResult.status === "rejected")
        errors.push(`LinkedIn: ${linkedinResult.reason}`);
      else if (!linkedinResult.value.posted)
        errors.push(
          `LinkedIn: ${linkedinResult.value.error || "not configured"}`,
        );
      result.error = errors.join("; ");
    }

    logger.info("Social media posting complete", {
      articleId: params.articleId,
      twitter: result.twitter,
      linkedin: result.linkedin,
      tweetId: result.tweetId,
      linkedinPostId: result.linkedinPostId,
    });

    return result;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error("Error posting to social media", error as Error, {
      articleId: params.articleId,
    });
    return { ...result, error: msg };
  }
}

// ─── Twitter/X API v2 ───────────────────────────────────────────────────────

/**
 * Twitter API v2 requires OAuth 1.0a User Context for creating tweets.
 * We build the Authorization header manually using HMAC-SHA1 signatures.
 */
async function postToTwitter(
  text: string,
): Promise<{ posted: boolean; id?: string; error?: string }> {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
    return { posted: false, error: "Twitter API credentials not configured" };
  }

  const url = "https://api.twitter.com/2/tweets";
  const method = "POST";

  try {
    const authHeader = buildOAuth1Header({
      method,
      url,
      apiKey,
      apiSecret,
      accessToken,
      accessTokenSecret,
    });

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (response.status === 429) {
      const resetAt = response.headers.get("x-rate-limit-reset");
      const resetDate = resetAt
        ? new Date(Number(resetAt) * 1000).toISOString()
        : "unknown";
      logger.warn("Twitter rate limit hit", { resetAt: resetDate });
      return { posted: false, error: `Rate limited until ${resetDate}` };
    }

    if (!response.ok) {
      const body = await response.text();
      logger.error("Twitter API error", new Error(body), {
        status: response.status,
      });
      return {
        posted: false,
        error: `HTTP ${response.status}: ${body.slice(0, 200)}`,
      };
    }

    const data = await response.json();
    const tweetId = data?.data?.id;
    logger.info("Tweet posted successfully", { tweetId });
    return { posted: true, id: tweetId };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error("Twitter posting failed", error as Error);
    return { posted: false, error: msg };
  }
}

// ─── OAuth 1.0a signature builder ───────────────────────────────────────────

function buildOAuth1Header(opts: {
  method: string;
  url: string;
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = randomBytes(16).toString("hex");

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: opts.apiKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: opts.accessToken,
    oauth_version: "1.0",
  };

  // Build signature base string (no body params for JSON content type)
  const paramString = Object.keys(oauthParams)
    .sort()
    .map((k) => `${percentEncode(k)}=${percentEncode(oauthParams[k])}`)
    .join("&");

  const baseString = [
    opts.method.toUpperCase(),
    percentEncode(opts.url),
    percentEncode(paramString),
  ].join("&");

  const signingKey = `${percentEncode(opts.apiSecret)}&${percentEncode(opts.accessTokenSecret)}`;
  const signature = createHmac("sha1", signingKey)
    .update(baseString)
    .digest("base64");

  oauthParams["oauth_signature"] = signature;

  const header = Object.keys(oauthParams)
    .sort()
    .map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
    .join(", ");

  return `OAuth ${header}`;
}

function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

// ─── LinkedIn API ────────────────────────────────────────────────────────────

/**
 * Post to LinkedIn as an organization using the UGC Posts API.
 * Requires: LINKEDIN_ACCESS_TOKEN and LINKEDIN_ORGANIZATION_ID
 *
 * LinkedIn API v2 docs:
 *   https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/ugc-post-api
 */
async function postToLinkedIn(
  text: string,
  params: SocialPostParams,
): Promise<{ posted: boolean; id?: string; error?: string }> {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const organizationId = process.env.LINKEDIN_ORGANIZATION_ID;

  if (!accessToken || !organizationId) {
    return { posted: false, error: "LinkedIn credentials not configured" };
  }

  const url = "https://api.linkedin.com/v2/ugcPosts";

  const articleUrl = params.url;
  const body = {
    author: `urn:li:organization:${organizationId}`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text },
        shareMediaCategory: "ARTICLE",
        media: [
          {
            status: "READY",
            originalUrl: articleUrl,
            title: { text: params.title },
            description: { text: params.excerpt?.slice(0, 200) || "" },
          },
        ],
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(body),
    });

    if (response.status === 429) {
      logger.warn("LinkedIn rate limit hit");
      return { posted: false, error: "LinkedIn rate limited" };
    }

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error("LinkedIn API error", new Error(errorBody), {
        status: response.status,
      });
      return {
        posted: false,
        error: `HTTP ${response.status}: ${errorBody.slice(0, 200)}`,
      };
    }

    // LinkedIn returns the post ID in the x-restli-id header or the response body
    const postId =
      response.headers.get("x-restli-id") || (await response.json())?.id;
    logger.info("LinkedIn post published", { postId });
    return { posted: true, id: postId };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error("LinkedIn posting failed", error as Error);
    return { posted: false, error: msg };
  }
}

// ─── Post text generators ────────────────────────────────────────────────────

/**
 * Generate Twitter post (280 chars max)
 */
function generateTwitterPost(params: SocialPostParams): string {
  const { title, excerpt, url, category } = params;

  const categoryEmoji: Record<string, string> = {
    "credit-cards": "\uD83D\uDCB3",
    "mutual-funds": "\uD83D\uDCC8",
    insurance: "\uD83D\uDEE1\uFE0F",
    loans: "\uD83D\uDCB0",
    "fixed-deposits": "\uD83C\uDFE6",
    "demat-accounts": "\uD83D\uDCCA",
    "tax-planning": "\uD83D\uDCCA",
  };

  const emoji = categoryEmoji[category] || "\uD83D\uDCDD";
  const maxLength = 280 - url.length - 5; // 5 chars buffer for newlines

  let post = `${emoji} ${title}\n\n`;

  if (excerpt && post.length < maxLength - 20) {
    const remaining = maxLength - post.length - 5;
    const truncated =
      excerpt.length > remaining
        ? excerpt.slice(0, remaining - 3) + "..."
        : excerpt;
    post += `${truncated}\n\n`;
  }

  post += url;

  // Hard cap at 280
  if (post.length > 280) {
    post = post.slice(0, 277) + "...";
  }

  return post;
}

/**
 * Generate LinkedIn post (3000 chars max)
 */
function generateLinkedInPost(params: SocialPostParams): string {
  const { title, excerpt, category } = params;

  const categoryHashtags: Record<string, string[]> = {
    "credit-cards": ["#CreditCards", "#PersonalFinance", "#India"],
    "mutual-funds": ["#MutualFunds", "#Investing", "#SIP", "#India"],
    insurance: ["#Insurance", "#FinancialPlanning", "#India"],
    loans: ["#Loans", "#PersonalFinance", "#HomeLoans", "#India"],
    "fixed-deposits": ["#FixedDeposits", "#FD", "#Investing", "#India"],
    "demat-accounts": ["#DematAccount", "#StockMarket", "#Investing", "#India"],
  };

  const hashtags = categoryHashtags[category] || [
    "#Finance",
    "#Investing",
    "#India",
  ];

  let post = `${title}\n\n`;

  if (excerpt) {
    post += `${excerpt}\n\n`;
  }

  post += `Read the full article on InvestingPro.in\n\n`;
  post += hashtags.join(" ");

  return post;
}
