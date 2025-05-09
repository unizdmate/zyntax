/**
 * Email template for magic link authentication
 */

export function getMagicLinkEmailTemplate(params: {
  url: string;
  host: string;
  email: string;
}): string {
  const { url, host, email } = params;
  
  // Extract the base URL without any query parameters
  const baseUrl = host.replace(/^https?:\/\//, '');

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign in to Zyntax</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #333;
            line-height: 1.6;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
          }
          
          .email-header {
            text-align: center;
            margin-bottom: 30px;
          }
          
          .logo {
            font-size: 24px;
            font-weight: 700;
            color: #1e84ff;
            margin-bottom: 10px;
          }
          
          .main-content {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
          }
          
          h1 {
            font-size: 20px;
            margin-bottom: 16px;
            color: #111;
          }
          
          p {
            margin-bottom: 20px;
          }
          
          .button {
            display: block;
            width: 100%;
            max-width: 280px;
            margin: 30px auto;
            padding: 12px 24px;
            background-color: #1e84ff;
            color: white;
            text-align: center;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            font-size: 16px;
            transition: background-color 0.2s;
          }
          
          .button:hover {
            background-color: #0069dd;
          }
          
          .link-text {
            margin: 20px 0;
            word-break: break-all;
            font-size: 14px;
            color: #6b7280;
          }
          
          .expire-text {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 20px;
          }
          
          .email-footer {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
          }
          
          .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 30px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email-header">
            <div class="logo">ZYNTAX</div>
          </div>
          
          <div class="main-content">
            <h1>Sign in to Zyntax</h1>
            
            <p>Hello,</p>
            
            <p>We received a sign-in request for your account: <strong>${email}</strong></p>
            
            <p>Click the button below to sign in to your account. If you didn't request this, you can safely ignore this email.</p>
            
            <a href="${url}" class="button">Sign in to Zyntax</a>
            
            <p class="expire-text">This link will expire in 24 hours and can only be used once.</p>
            
            <div class="divider"></div>
            
            <p>If the button above doesn't work, you can copy and paste this URL into your browser:</p>
            <p class="link-text">${url}</p>
          </div>
          
          <div class="email-footer">
            <p>&copy; ${new Date().getFullYear()} Zyntax. All rights reserved.</p>
            <p>You received this email because a sign-in was requested for your account.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}