import { Resend } from 'resend';
import { getMagicLinkEmailTemplate } from './magicLinkTemplate';
import type { SendVerificationRequestParams } from 'next-auth/providers/email';

// Initialize Resend with API key
const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

/**
 * Send a magic link email using Resend
 */
export async function sendResendEmail({
  identifier,
  url,
  provider,
}: SendVerificationRequestParams): Promise<void> {
  const { host } = new URL(url);

  // Generate email HTML content using our template
  const emailHtml = getMagicLinkEmailTemplate({
    url,
    host,
    email: identifier,
  });

  try {
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@zyntax.app',
      to: identifier,
      subject: 'Sign in to Zyntax',
      html: emailHtml,
    });

    if (error) {
      console.error('RESEND_ERROR', error);
      throw new Error(`Failed to send verification email: ${error.message}`);
    }

    console.log('Email sent successfully with Resend ID:', data?.id);
  } catch (error) {
    console.error('SEND_RESEND_EMAIL_ERROR', error);
    throw new Error('Failed to send verification email');
  }
}