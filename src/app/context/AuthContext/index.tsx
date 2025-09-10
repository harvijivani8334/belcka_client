"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import InviteErrorPage from "@/app/components/InviteErrorPage";
import { CircularProgress } from "@mui/material";

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
  const [inviteError, setInviteError] = useState(false);

  const user = session?.user as ExtendedUser;
  const inviteFromUrl = searchParams?.get("invite");

  useEffect(() => {
    const cleanPath = pathname.split("?")[0];

    if (status === "unauthenticated" && !PUBLIC_ROUTES.includes(cleanPath)) {
      router.replace("/auth");
    }

    if (
      status === "authenticated" &&
      inviteFromUrl &&
      user?.invite_link &&
      user.invite_link !== inviteFromUrl
    ) {
      setInviteError(true);
    } else {
      setInviteError(false);
    }
  }, [status, pathname, router, inviteFromUrl, user?.invite_link]);

  if (status === "loading") {
    return null; // spinner placeholder
  }

  if (inviteError) {
    return <InviteErrorPage onLogout={() => signOut({ callbackUrl: "/auth" })} />;
  }

  if (status === "unauthenticated" && !PUBLIC_ROUTES.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // ✅ Wrap with Suspense to avoid "missing suspense" error
  return (
    <Suspense fallback={null}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </Suspense>
  );
}
