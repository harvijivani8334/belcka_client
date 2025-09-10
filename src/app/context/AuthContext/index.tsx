"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Typography, Box, Paper } from "@mui/material";

const PUBLIC_ROUTES = ["/auth", "/privacy-policy", "/app-info"];

type ExtendedUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  invite_link?: string | null;
};

const InviteErrorPage = ({ onLogout }: { onLogout: () => void }) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="50vh"
    bgcolor="#f9f9f9"
  >
    <Paper sx={{ p:8, textAlign: "center", borderRadius: 2 }}>
      <Typography variant="h1" color="error" mb={2}>
        ⚠️ Incorrect login link
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        You are logged in through a different link. 
        <br />
        Please log out and log in again using your assigned link and credentials.
      </Typography>
      <Button
        variant="outlined"
        color="error"
        size="large"
        onClick={onLogout}
        sx={{ px: 4, py: 1 }}
      >
        Logout
      </Button>
    </Paper>
  </Box>
);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const [hasMounted, setHasMounted] = useState(false);
  const [inviteError, setInviteError] = useState(false);

  const user = session?.user as ExtendedUser;
  const inviteFromUrl = searchParams ? searchParams.get("invite") : "";

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const cleanPath = pathname.split("?")[0];

    // unauthenticated → redirect unless public
    if (status === "unauthenticated" && !PUBLIC_ROUTES.includes(cleanPath)) {
      router.replace("/auth");
    }

    // ✅ check invite mismatch
    if (
      status === "authenticated" &&
      inviteFromUrl &&
      user?.invite_link &&
      user.invite_link !== inviteFromUrl
    ) {
      setInviteError(true);
    }
  }, [status, pathname, router, hasMounted, inviteFromUrl, user?.invite_link]);

  if (!hasMounted || status === "loading") {
    return null; // spinner
  }

  if (inviteError) {
    return (
      <InviteErrorPage onLogout={() => signOut({ callbackUrl: "/auth" })} />
    );
  }

  if (status === "unauthenticated" && !PUBLIC_ROUTES.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
};

export default AuthProvider;
