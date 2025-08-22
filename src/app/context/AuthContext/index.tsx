"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const PUBLIC_ROUTES = ["/auth", "/privacy-policy", "/app-info"];

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const cleanPath = pathname.split("?")[0];

    if (status === "unauthenticated" && !PUBLIC_ROUTES.includes(cleanPath)) {
      router.replace("/auth");
    }
  }, [status, pathname, router, hasMounted]);

  if (!hasMounted || status === "loading") {
    return null; // or loading spinner
  }

  if (status === "unauthenticated" && !PUBLIC_ROUTES.includes(pathname)) {
    return null; // redirect will happen
  }

  return <>{children}</>;
};

export default AuthProvider;
