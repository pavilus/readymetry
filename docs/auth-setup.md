# Readymetry authentication setup

## Current configuration

- Site URL: `https://readymetry.com`
- Allowed redirect URLs: `https://readymetry.com/**`
- Email confirmation: required
- Password minimum: 8 characters
- Custom SMTP: not configured
- CAPTCHA: not configured

## Custom SMTP

Configure a dedicated Readymetry sender in Supabase under **Authentication > SMTP Settings**. Use a verified domain and a sender such as `Readymetry <no-reply@readymetry.com>`.

Required provider values:

- SMTP host and port
- SMTP username and password
- Verified sender email
- Sender name

After configuration, test signup confirmation, password reset, expired links, and resend behavior. These credentials are not currently available in the repository or VPS environment.

## CAPTCHA

Create a Cloudflare Turnstile or hCaptcha site for `readymetry.com`, then configure the site key in the frontend and secret key in Supabase Authentication settings. CAPTCHA remains blocked until those provider credentials exist.
