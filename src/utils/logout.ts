import { signOut } from "next-auth/react";

export function logoutWithInviteRedirect() {
  if (typeof window === "undefined") return;

  const saved = localStorage.getItem("invite_redirect_url");

  const authBaseUrl = process.env.NEXT_PUBLIC_AUTH_URL || "/auth";

  const redirectUrl =
    saved ||
    authBaseUrl; 

  return signOut({ callbackUrl: redirectUrl });
}
