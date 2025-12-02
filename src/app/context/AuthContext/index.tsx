"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, Suspense, useState } from "react";
import api from "@/utils/axios";
import toast from "react-hot-toast";
import { logoutWithInviteRedirect } from "@/utils/logout";

const PUBLIC_ROUTES = ["/auth", "/privacy-policy", "/app-info"];

type ExtendedUser = {
  id: number;
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
  const userInvite = user?.invite_link?.split("invite=")[1];

  const [isExpired, setIsExpired] = useState(false);

  const fullInviteUrl = useMemo(() => {
    if (!inviteFromUrl) return null;
    const authBaseUrl = `${window.location.origin}/auth`;
    return `${authBaseUrl}?invite=${inviteFromUrl}`;
  }, [inviteFromUrl]);

  useEffect(() => {
    if (fullInviteUrl) {
      localStorage.setItem("invite_redirect_url", fullInviteUrl);
    }
  }, [fullInviteUrl]);

  const getUserData = async () => {
    try {
      const response = await api.get(
        `company-clients/invitation-link?user_id=${user?.id}`
      );

      if (response.data.IsSuccess) {
        setIsExpired(response.data.info.is_expired);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && user?.id) {
      getUserData();
    }
  }, [status, user?.id]);

  useEffect(() => {
    if (isExpired) {
      toast.error("Your invitation link has expired!");
      logoutWithInviteRedirect();
    }
  }, [isExpired]);

  const shouldShowInviteError = useMemo(() => {
    return (
      status === "authenticated" &&
      inviteFromUrl !== null &&
      !!userInvite &&
      user?.email !== undefined &&
      userInvite !== inviteFromUrl
    );
  }, [status, inviteFromUrl, userInvite, user?.email]);

  useEffect(() => {
    if (shouldShowInviteError) {
      logoutWithInviteRedirect();
    }
  }, [shouldShowInviteError]);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated") {
      if (cleanPath === "/") {
        router.replace("/apps/projects/list");
      }
      return;
    }

    if (status === "unauthenticated" && !PUBLIC_ROUTES.includes(cleanPath)) {
      router.replace("/auth");
    }
  }, [status, cleanPath]);

  if (status === "loading") return null;

  return <>{children}</>;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </Suspense>
  );
}
