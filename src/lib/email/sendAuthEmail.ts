import { sendResendEmail } from './resendService';
import type { SendVerificationRequestParams } from 'next-auth/providers/email';

/**
 * Sends an authentication email with magic link
 * This function acts as a wrapper to use the correct email service
 */
export async function sendAuthEmail(params: SendVerificationRequestParams): Promise<void> {
  // Use the Resend implementation
  await sendResendEmail(params);
}