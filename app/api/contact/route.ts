import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/resend-service";
import { z } from "zod";
import { logger } from "@/lib/logger";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(20),
  type: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error },
        { status: 400 },
      );
    }

    const { name, email, subject, message, type } = validation.data;

    // Send Email to Support
    const supportEmail = process.env.SUPPORT_EMAIL || "contact@investingpro.in"; // Fallback

    const result = await sendEmail({
      to: supportEmail,
      replyTo: email,
      subject: `[${type.toUpperCase()}] ${subject}`,
      html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Type:</strong> ${type}</p>
                    <hr />
                    <h3>Message:</h3>
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
            `,
      text: `New Contact Submission from ${name} (${email}):\n\n${message}`,
    });

    if (!result.success) {
      logger.error(
        "Email sending failed",
        result.error instanceof Error
          ? result.error
          : new Error(String(result.error)),
      );
      // In a real app we might want to return 500, but often we fake success to user if it's a transient spam check or similar
      // But here we'll be honest
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error(
      "Contact API error",
      error instanceof Error ? error : new Error(String(error)),
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
