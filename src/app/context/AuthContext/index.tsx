"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, Suspense, useState } from "react";
import InviteErrorPage from "@/app/components/InviteErrorPage";
import api from "@/utils/axios";
import toast from "react-hot-toast";

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
  const [fullUrl, setFullUrl] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const queryString = searchParams ? searchParams.toString() : "";
    const origin = window.location.origin;
    const completeUrl = queryString
      ? `${origin}${pathname}?${queryString}`
      : `${origin}${pathname}`;
    setFullUrl(completeUrl);
  }, [pathname, searchParams]);

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
    } finally {
      setChecked(true);
    }
  };
  useEffect(() => {
    if (status === "authenticated" && user?.id) {
      getUserData();
    }
  }, [status, user?.id]);

  useEffect(() => {
    if (isExpired) {
      toast.error("Your invitation link has been expired!");
      signOut({ callbackUrl: "/auth" });
    }
  }, [isExpired]);

  const shouldShowInviteError = useMemo(() => {
    return (
      status === "authenticated" &&
      inviteFromUrl !== null &&
      !!userInvite &&
      user.email !== undefined &&
      userInvite !== inviteFromUrl
    );
  }, [status, inviteFromUrl, userInvite, user?.email]);

  useEffect(() => {
    if (status === "authenticated" && cleanPath === "/") {
      router.replace("/apps/projects/list");
    }

    if (status === "unauthenticated" && !PUBLIC_ROUTES.includes(cleanPath)) {
      router.replace("/auth");
    }
  }, [status, cleanPath, inviteFromUrl, userInvite, router]);

  if (status === "loading") return null;

  if (shouldShowInviteError) {
    return signOut({ callbackUrl: `${fullUrl}` });
    // <InviteErrorPage onLogout={() => signOut({ callbackUrl: "/auth" })} />
  }

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
