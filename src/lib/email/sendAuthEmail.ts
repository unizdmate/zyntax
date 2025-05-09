import { getMagicLinkEmailTemplate } from './magicLinkTemplate';
import type { SendVerificationRequestParams } from 'next-auth/providers/email';

/**
 * Sends a custom email with magic link using the configured email provider
 */
export async function sendAuthEmail({
  identifier,
  url,
  provider,
}: SendVerificationRequestParams): Promise<void> {
  const { host } = new URL(url);
  
  const transport = {
    host: provider.server.host,
    port: provider.server.port,
    auth: {
      user: provider.server.auth.user,
      pass: provider.server.auth.pass,
    },
    secure: provider.server.port === 465,
  };

  const emailHtml = getMagicLinkEmailTemplate({
    url,
    host,
    email: identifier,
  });

  try {
    // Use nodemailer directly if you want to avoid an extra dependency
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport(transport);
    
    await transporter.sendMail({
      to: identifier,
      from: provider.from,
      subject: `Sign in to Zyntax`,
      html: emailHtml,
    });
  } catch (error) {
    console.error('SEND_AUTH_EMAIL_ERROR', error);
    throw new Error('Failed to send verification email');
  }
}