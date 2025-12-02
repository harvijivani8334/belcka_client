import { signOut } from "next-auth/react";

export function logoutWithInviteRedirect() {
  if (typeof window === "undefined") return;

  const saved = localStorage.getItem("invite_redirect_url");

  const redirectUrl =
    saved ? saved : `${process.env.NEXT_PUBLIC_AUTH_URL}auth`;

  return signOut({ callbackUrl: redirectUrl });
}
