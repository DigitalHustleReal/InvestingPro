import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend-service";
import { sendWelcomeSequence } from "@/lib/email/sequences";
import { logger } from "@/lib/logger";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  source: string;
  status: "active" | "unsubscribed" | "bounced";
  confirmed: boolean;
  confirm_token?: string;
  confirmed_at?: string;
  unsubscribed_at?: string;
  tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface SubscribeResult {
  success: boolean;
  message: string;
  requiresVerification?: boolean;
}

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://investingpro.in";

class NewsletterService {
  /**
   * Subscribe a new email to the newsletter.
   * Matches the real DB schema: newsletter_subscribers with status/confirmed/confirm_token columns.
   */
  async subscribe(data: {
    email: string;
    name?: string;
    source?: string;
    interests?: string[];
    frequency?: "daily" | "weekly" | "monthly";
  }): Promise<SubscribeResult> {
    try {
      const {
        email,
        name,
        source = "website",
        interests = [],
        frequency = "weekly",
      } = data;

      if (!this.isValidEmail(email)) {
        return { success: false, message: "Invalid email address" };
      }

      const supabase = getSupabaseAdmin();
      const normalizedEmail = email.toLowerCase().trim();

      // Check if already subscribed
      const { data: existing } = await supabase
        .from("newsletter_subscribers")
        .select("id, status, confirmed")
        .eq("email", normalizedEmail)
        .single();

      if (existing) {
        if (existing.status === "active" && existing.confirmed) {
          return {
            success: false,
            message: "This email is already subscribed",
          };
        }
        if (existing.status === "active" && !existing.confirmed) {
          // Resend confirmation
          await this.sendConfirmationEmail(normalizedEmail);
          return {
            success: true,
            message: "Confirmation email resent. Please check your inbox.",
            requiresVerification: true,
          };
        }
        // Was unsubscribed — resubscribe
        const newToken = crypto.randomUUID();
        await supabase
          .from("newsletter_subscribers")
          .update({
            status: "active",
            confirmed: false,
            confirm_token: newToken,
            unsubscribed_at: null,
            name: name || undefined,
            tags: interests,
            metadata: { frequency },
          })
          .eq("id", existing.id);

        await this.sendConfirmationEmail(normalizedEmail, newToken);
        return {
          success: true,
          message: "Please check your email to confirm your subscription.",
          requiresVerification: true,
        };
      }

      // Create new subscriber (confirm_token has default in DB via gen_random_uuid)
      const { data: newSub, error } = await supabase
        .from("newsletter_subscribers")
        .insert({
          email: normalizedEmail,
          name: name || null,
          source,
          status: "active",
          confirmed: false,
          tags: interests,
          metadata: { frequency },
        })
        .select("id, confirm_token")
        .single();

      if (error) throw error;

      // Send confirmation email
      await this.sendConfirmationEmail(normalizedEmail, newSub?.confirm_token);

      return {
        success: true,
        message: "Please check your email to confirm your subscription.",
        requiresVerification: true,
      };
    } catch (error) {
      logger.error("Newsletter subscription failed", error as Error);
      return {
        success: false,
        message: "Subscription failed. Please try again.",
      };
    }
  }

  /**
   * Verify / confirm email subscription via token
   */
  async verify(token: string): Promise<SubscribeResult> {
    try {
      const supabase = getSupabaseAdmin();

      const { data: subscriber, error } = await supabase
        .from("newsletter_subscribers")
        .select("id, email, confirmed")
        .eq("confirm_token", token)
        .eq("status", "active")
        .eq("confirmed", false)
        .single();

      if (error || !subscriber) {
        return {
          success: false,
          message: "Invalid or expired confirmation link",
        };
      }

      await supabase
        .from("newsletter_subscribers")
        .update({
          confirmed: true,
          confirmed_at: new Date().toISOString(),
          confirm_token: null,
        })
        .eq("id", subscriber.id);

      // Trigger welcome email sequence after confirmation
      try {
        await sendWelcomeSequence(subscriber.email, subscriber.id);
      } catch (seqError) {
        // Don't fail the confirmation if welcome sequence errors
        logger.error(
          "Welcome sequence failed after confirmation",
          seqError as Error,
          { email: subscriber.email },
        );
      }

      return {
        success: true,
        message: "Email confirmed! You're now subscribed.",
      };
    } catch (error) {
      logger.error("Newsletter verification failed", error as Error);
      return {
        success: false,
        message: "Verification failed. Please try again.",
      };
    }
  }

  /**
   * Unsubscribe from newsletter
   */
  async unsubscribe(email: string): Promise<SubscribeResult> {
    try {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase
        .from("newsletter_subscribers")
        .update({
          status: "unsubscribed",
          unsubscribed_at: new Date().toISOString(),
        })
        .eq("email", email.toLowerCase().trim());

      if (error) throw error;

      return {
        success: true,
        message: "You have been unsubscribed successfully.",
      };
    } catch (error) {
      logger.error("Newsletter unsubscribe failed", error as Error);
      return {
        success: false,
        message: "Unsubscribe failed. Please try again.",
      };
    }
  }

  /**
   * Get confirmed subscriber count
   */
  async getSubscriberCount(): Promise<number> {
    try {
      const supabase = getSupabaseAdmin();
      const { count, error } = await supabase
        .from("newsletter_subscribers")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")
        .eq("confirmed", true);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Update subscriber preferences
   */
  async updatePreferences(
    email: string,
    preferences: {
      interests?: string[];
      frequency?: "daily" | "weekly" | "monthly";
    },
  ): Promise<SubscribeResult> {
    try {
      const supabase = getSupabaseAdmin();
      const updateData: Record<string, unknown> = {};
      if (preferences.interests) updateData.tags = preferences.interests;
      if (preferences.frequency)
        updateData.metadata = { frequency: preferences.frequency };

      const { error } = await supabase
        .from("newsletter_subscribers")
        .update(updateData)
        .eq("email", email.toLowerCase().trim())
        .eq("status", "active");

      if (error) throw error;

      return { success: true, message: "Preferences updated successfully." };
    } catch (error) {
      logger.error("Newsletter preferences update failed", error as Error);
      return { success: false, message: "Update failed. Please try again." };
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Send confirmation email with verification link
   */
  private async sendConfirmationEmail(
    email: string,
    token?: string,
  ): Promise<void> {
    if (!token) {
      // Fetch token from DB if not provided
      const supabase = getSupabaseAdmin();
      const { data } = await supabase
        .from("newsletter_subscribers")
        .select("confirm_token")
        .eq("email", email)
        .single();
      token = data?.confirm_token;
    }

    if (!token) {
      logger.warn("No confirm_token available for confirmation email", {
        email,
      });
      return;
    }

    const verifyUrl = `${SITE_URL}/api/newsletter?action=verify&token=${token}`;

    await sendEmail({
      to: email,
      subject: "Confirm your InvestingPro newsletter subscription",
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #166534 0%, #16A34A 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">Confirm Your Subscription</h1>
    </div>
    <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        <p>Thanks for subscribing to InvestingPro!</p>
        <p>Please confirm your email address by clicking the button below:</p>
        <div style="margin: 30px 0; text-align: center;">
            <a href="${verifyUrl}" style="display: inline-block; background: #166534; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                Confirm My Email
            </a>
        </div>
        <p style="color: #64748b; font-size: 13px;">If you didn't subscribe, you can safely ignore this email.</p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 30px;">— Team InvestingPro</p>
    </div>
</body>
</html>`.trim(),
    });

    logger.info("Confirmation email sent", { email });
  }
}

export const newsletterService = new NewsletterService();
