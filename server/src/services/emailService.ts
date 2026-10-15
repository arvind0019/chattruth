export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  private resendApiKey = process.env.RESEND_API_KEY || '';
  private fromAddress = process.env.EMAIL_FROM || 'ChatTruth <notifications@chattruth.app>';

  /**
   * Dispatches email via Resend or logs safely in development mode.
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    const { to, subject, html } = options;

    if (this.resendApiKey && process.env.NODE_ENV === 'production') {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(this.resendApiKey);

        const result = await resend.emails.send({
          from: this.fromAddress,
          to,
          subject,
          html,
        });

        console.log(`[EmailService] Resend email dispatched to ${to}: ${result.data?.id}`);
        return true;
      } catch (err: any) {
        console.error(`[EmailService] Resend email delivery failed to ${to}:`, err.message);
        return false;
      }
    }

    // Local development mock mode
    console.log(`\n================== [MOCK EMAIL DISPATCH] ==================`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Sender: ${this.fromAddress}`);
    console.log(`[Body Snippet]: ${html.slice(0, 140).replace(/<[^>]*>/g, '')}...`);
    console.log(`===========================================================\n`);
    return true;
  }

  /**
   * Email Verification Template
   */
  async sendVerificationEmail(to: string, verificationUrl: string): Promise<boolean> {
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFEFA; border: 1px solid #E3E1D9; border-radius: 12px; padding: 32px; color: #242923;">
        <div style="border-bottom: 2px solid #304A34; padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="color: #304A34; margin: 0; font-size: 24px;">ChatTruth</h2>
          <p style="margin: 4px 0 0; color: #5A6559; font-size: 14px;">Understand more. Assume less.</p>
        </div>
        <h3 style="font-size: 20px; color: #242923;">Verify your email address</h3>
        <p style="font-size: 15px; line-height: 1.6; color: #5A6559;">
          Welcome to ChatTruth. Please verify your email address to access your conversation reports and secure your account.
        </p>
        <div style="margin: 32px 0;">
          <a href="${verificationUrl}" style="background-color: #304A34; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 15px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p style="font-size: 13px; color: #7F8A7D;">
          If the button above does not work, copy and paste this URL into your browser:<br/>
          <a href="${verificationUrl}" style="color: #304A34;">${verificationUrl}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #E3E1D9; margin: 32px 0;" />
        <p style="font-size: 12px; color: #7F8A7D; margin: 0;">
          If you did not create a ChatTruth account, you can safely ignore this email.
        </p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'Verify your ChatTruth account',
      html,
    });
  }

  /**
   * Password Reset Template
   */
  async sendPasswordResetEmail(to: string, resetUrl: string): Promise<boolean> {
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFEFA; border: 1px solid #E3E1D9; border-radius: 12px; padding: 32px; color: #242923;">
        <div style="border-bottom: 2px solid #304A34; padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="color: #304A34; margin: 0; font-size: 24px;">ChatTruth</h2>
        </div>
        <h3 style="font-size: 20px; color: #242923;">Reset your password</h3>
        <p style="font-size: 15px; line-height: 1.6; color: #5A6559;">
          We received a request to reset the password for your ChatTruth account. Click the button below to choose a new password. This link expires in 1 hour.
        </p>
        <div style="margin: 32px 0;">
          <a href="${resetUrl}" style="background-color: #304A34; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 15px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 13px; color: #7F8A7D;">
          If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'Reset your ChatTruth password',
      html,
    });
  }

  /**
   * Report Ready Notification
   * Note: Under privacy requirements, never include sensitive conversation excerpts in email.
   */
  async sendReportReadyEmail(to: string, reportTitle: string, reportUrl: string): Promise<boolean> {
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFEFA; border: 1px solid #E3E1D9; border-radius: 12px; padding: 32px; color: #242923;">
        <div style="border-bottom: 2px solid #304A34; padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="color: #304A34; margin: 0; font-size: 24px;">ChatTruth</h2>
        </div>
        <h3 style="font-size: 20px; color: #242923;">Your conversation report is ready</h3>
        <p style="font-size: 15px; line-height: 1.6; color: #5A6559;">
          The AI analysis for <strong>${reportTitle}</strong> has finished processing. Your structured report, communication patterns, and verified statistics are now available.
        </p>
        <div style="margin: 32px 0;">
          <a href="${reportUrl}" style="background-color: #304A34; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 15px; display: inline-block;">
            View Your Report
          </a>
        </div>
        <p style="font-size: 13px; color: #7F8A7D;">
          To safeguard your privacy, ChatTruth never includes chat quotes or excerpt text in email notifications.
        </p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: `Your ChatTruth Report is ready: ${reportTitle}`,
      html,
    });
  }

  /**
   * Payment Receipt Email
   */
  async sendPaymentReceiptEmail(to: string, amountFormatted: string, orderId: string, reportUrl: string): Promise<boolean> {
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFEFA; border: 1px solid #E3E1D9; border-radius: 12px; padding: 32px; color: #242923;">
        <div style="border-bottom: 2px solid #304A34; padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="color: #304A34; margin: 0; font-size: 24px;">ChatTruth</h2>
        </div>
        <h3 style="font-size: 20px; color: #242923;">Payment Confirmation</h3>
        <p style="font-size: 15px; line-height: 1.6; color: #5A6559;">
          Thank you for your purchase. Your full report has been unlocked and is available on your dashboard.
        </p>
        <div style="background: #F7F6F0; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 14px;">
          <p style="margin: 4px 0;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="margin: 4px 0;"><strong>Amount Paid:</strong> ${amountFormatted}</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> Verified & Complete</p>
        </div>
        <div style="margin: 24px 0;">
          <a href="${reportUrl}" style="background-color: #304A34; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 15px; display: inline-block;">
            Access Full Report
          </a>
        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'ChatTruth Payment Confirmation & Receipt',
      html,
    });
  }
}

export const emailService = new EmailService();
