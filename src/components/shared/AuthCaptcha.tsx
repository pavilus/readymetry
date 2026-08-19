"use client";

import { Turnstile } from "@marsidev/react-turnstile";

export const authCaptchaEnabled = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

export default function AuthCaptcha({ onToken, resetKey }: { onToken: (token: string | null) => void; resetKey: number }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;

  return (
    <Turnstile
      key={resetKey}
      siteKey={siteKey}
      onSuccess={(token) => onToken(token)}
      onExpire={() => onToken(null)}
      onError={() => onToken(null)}
      options={{ theme: "light", size: "flexible" }}
    />
  );
}
