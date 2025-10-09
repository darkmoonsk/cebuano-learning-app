import { EmailService } from "@/application/services/email-service";
import { Resend } from "resend";

export class ResendEmailService implements EmailService {
  constructor(
    private readonly apiKey: string | undefined,
    private readonly fromEmail: string | undefined,
    private readonly appBaseUrl: string | undefined
  ) {}

  async sendPasswordResetEmail(params: { toEmail: string; resetLink: string }) {
    if (!this.apiKey || !this.fromEmail) {
      console.warn("Resend not configured; skipping email send");
      return;
    }

    const resend = new Resend(this.apiKey);

    const subject = "Reset your Cebuano app password";
    const html = this.renderResetEmailHtml(params.resetLink);

    await resend.emails.send({
      from: this.fromEmail,
      to: params.toEmail,
      subject,
      html,
    });
  }

  private renderResetEmailHtml(resetLink: string) {
    const safeLink = resetLink;
    return (
      `<!doctype html>` +
      `<html><body style="font-family:system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif">` +
      `<h2>Reset your password</h2>` +
      `<p>We received a request to reset your password. If you did not request a password reset, you can safely ignore this email.</p>` +
      `<p><a href="${safeLink}" style="display:inline-block;background:#0077b6;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Reset password</a></p>` +
      `<p>Or copy and paste this link into your browser:<br/><span>${safeLink}</span></p>` +
      `<p style="color:#6b7280;font-size:12px">This link will expire soon.</p>` +
      `</body></html>`
    );
  }
}
