import { signOut } from "next-auth/react";

export function logoutWithInviteRedirect() {
  if (typeof window === "undefined") return;

  const saved = localStorage.getItem("invite_redirect_url");

  const authBaseUrl = `${window.location.origin}/auth` || "/auth";

  const redirectUrl =
    saved ||
    authBaseUrl; 

  return signOut({ callbackUrl: redirectUrl });
}
