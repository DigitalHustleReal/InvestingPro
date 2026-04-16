import Link from "next/link";
import Image from "next/image";

// Helper to normalize credentials (handles string, array, or undefined)
function normalizeCredentials(
  credentials: string[] | string | undefined,
): string[] {
  if (Array.isArray(credentials)) return credentials;
  if (typeof credentials === "string" && credentials.trim()) {
    return credentials
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  }
  return [];
}

interface Author {
  id: string;
  name: string;
  slug: string;
  title: string;
  photoUrl?: string;
  credentials?: string[];
}

interface AttributionProps {
  contentType: "glossary_term" | "article" | "guide" | "comparison" | "news";
  author?: Author | null;
  reviewer?: Author | null;
  showAuthor?: boolean;
  showReviewer?: boolean;
  reviewerLabel?: string;
  publishedAt?: string;
  updatedAt?: string;
  lastReviewedAt?: string;
}

/**
 * Industry-Standard Content Attribution Component
 * Matches patterns from Investopedia, NerdWallet, The Balance
 */
export function ContentAttribution({
  contentType,
  author,
  reviewer,
  showAuthor = true,
  showReviewer = true,
  reviewerLabel = "Reviewed by",
  publishedAt,
  updatedAt,
  lastReviewedAt,
}: AttributionProps) {
  // PATTERN 1: Glossary Term - Just Expert Reviewer
  if (contentType === "glossary_term") {
    return (
      <div className="content-attribution glossary-attribution">
        {showReviewer && reviewer && (
          <div className="expert-review-badge">
            <div className="verification-icon">
              <svg
                className="w-5 h-5 text-success-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="reviewer-info">
              <div className="reviewer-label">Reviewed for Accuracy</div>
              <div className="reviewer-name">
                <strong>{reviewer.name}</strong>
                {(() => {
                  const creds = normalizeCredentials(reviewer.credentials);
                  return creds.length > 0 ? (
                    <span className="credentials">, {creds[0]}</span>
                  ) : null;
                })()}
              </div>
              {lastReviewedAt && (
                <div className="review-date">
                  Last reviewed: {formatDate(lastReviewedAt)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // PATTERN 2: Article/Guide - Full Attribution
  if (contentType === "article" || contentType === "guide") {
    return (
      <div className="content-attribution article-attribution">
        <div className="attribution-grid">
          {/* Author */}
          {showAuthor && author && (
            <div className="author-byline">
              {author.photoUrl && (
                <Image
                  src={author.photoUrl}
                  alt={author.name}
                  width={48}
                  height={48}
                  className="author-photo rounded-full"
                />
              )}
              <div className="author-details">
                <div className="author-label">Written by</div>
                <Link
                  href={`/author/${author.slug}`}
                  className="author-name font-semibold hover:text-primary"
                >
                  {author.name}
                </Link>
                {author.title && (
                  <div className="author-title text-sm text-gray-600">
                    {author.title}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reviewer */}
          {showReviewer && reviewer && (
            <div className="reviewer-byline">
              <div className="reviewer-label text-sm text-gray-600">
                {reviewerLabel}
              </div>
              <div className="reviewer-name font-medium">{reviewer.name}</div>
              {(() => {
                const creds = normalizeCredentials(reviewer.credentials);
                return creds.length > 0 ? (
                  <div className="reviewer-credentials text-sm text-gray-600">
                    {reviewer.title} | {creds[0]}
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Dates */}
          <div className="content-dates text-sm text-gray-600">
            {publishedAt && <div>Published: {formatDate(publishedAt)}</div>}
            {updatedAt && updatedAt !== publishedAt && (
              <div>Updated: {formatDate(updatedAt)}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // PATTERN 3: Comparison/List - Minimal Byline
  if (contentType === "comparison") {
    return (
      <div className="content-attribution minimal-attribution">
        {showAuthor && author && (
          <div className="simple-byline text-sm text-gray-600">
            <span>By </span>
            <Link
              href={`/author/${author.slug}`}
              className="font-medium hover:text-primary"
            >
              {author.name}
            </Link>
            {updatedAt && (
              <span className="ml-3">
                Last updated: {formatDate(updatedAt)}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // PATTERN 4: News - Simple Byline
  if (contentType === "news") {
    return (
      <div className="content-attribution news-attribution">
        {showAuthor && author && (
          <div className="news-byline text-sm">
            <span className="text-gray-600">By </span>
            <Link
              href={`/author/${author.slug}`}
              className="font-medium hover:text-primary"
            >
              {author.name}
            </Link>
            {publishedAt && (
              <span className="ml-3 text-gray-600">
                {formatDateTime(publishedAt)}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Default
  return null;
}

/**
 * Author Bio Card - For article footers
 */
export function AuthorBioCard({ author }: { author: Author }) {
  const credentialsArray = normalizeCredentials(author.credentials);

  return (
    <div className="author-bio-card border rounded-lg p-6 bg-gray-50">
      <div className="flex gap-4">
        {author.photoUrl && (
          <Image
            src={author.photoUrl}
            alt={author.name}
            width={80}
            height={80}
            className="rounded-full flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <Link href={`/author/${author.slug}`}>
            <h3 className="text-xl font-semibold hover:text-primary mb-1">
              {author.name}
            </h3>
          </Link>
          {author.title && (
            <p className="text-sm text-gray-600 mb-2">{author.title}</p>
          )}
          {credentialsArray.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {credentialsArray.map((cred, idx) => (
                <span key={idx} className="badge badge-sm">
                  {cred}
                </span>
              ))}
            </div>
          )}
          <Link
            href={`/author/${author.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            View Full Profile →
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Editorial Standards Disclosure
 */
export function EditorialDisclosure() {
  return (
    <div className="editorial-disclosure border-t pt-6 mt-8">
      <h4 className="font-semibold mb-2">Our Editorial Process</h4>
      <p className="text-sm text-gray-600">
        All content on InvestingPro is fact-checked against official sources
        including RBI circulars, SEBI guidelines, the Income Tax Act, and
        product issuer terms. We do not accept sponsored editorial content.
        Articles are updated when underlying data changes — new rates, budget
        amendments, or product launches.
      </p>
      <Link
        href="/about/editorial-standards"
        className="text-sm text-primary hover:underline mt-2 inline-block"
      >
        Read our full editorial standards →
      </Link>
    </div>
  );
}

// Helper functions
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
