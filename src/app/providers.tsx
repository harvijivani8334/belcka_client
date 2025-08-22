import { SessionProvider } from "next-auth/react";

export default function Providers({ children, session }: { children: React.ReactNode; session: any }) {
  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus={false} 
      refetchInterval={0} 
    >
      {children}
    </SessionProvider>
  );
}
