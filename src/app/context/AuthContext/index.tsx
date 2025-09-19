"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import InviteErrorPage from "@/app/components/InviteErrorPage";

const PUBLIC_ROUTES = ["/auth", "/privacy-policy", "/app-info"];

type ExtendedUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  invite_link?: string | null;
};

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();

  const user = session?.user as ExtendedUser | undefined;
  const inviteFromUrl = searchParams?.get("invite") ?? null;
  const cleanPath = pathname.split("?")[0];

  const shouldShowInviteError = useMemo(() => {
    return (
      status === "authenticated" &&
      !!inviteFromUrl &&
      !!user?.invite_link &&
      user.invite_link !== inviteFromUrl
    );
  }, [status, inviteFromUrl, user?.invite_link]);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" && !PUBLIC_ROUTES.includes(cleanPath)) {
      router.replace("/auth");
    }
  }, [status, cleanPath, router]);

  if (status === "loading") {
    return null;
  }

  if (shouldShowInviteError) {
    return (
      <InviteErrorPage onLogout={() => signOut({ callbackUrl: "/auth" })} />
    );
  }

  if (status === "unauthenticated" && !PUBLIC_ROUTES.includes(cleanPath)) {
    return null;
  }

  return <>{children}</>;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthProviderInner>{children}</AuthProviderInner>
    </>
  );
}
