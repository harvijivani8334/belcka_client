"use client";

import { signOut } from "next-auth/react";
import { Button } from "@mui/material";

export default function InviteErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold text-red-600">
        Invalid or mismatched invite link
      </h1>
      <p className="mt-2 text-gray-600">
        You are logged in with a different invite. Please log out to continue.
      </p>
      <Button
        className="mt-4"
        variant="contained"
        color="error"
        onClick={() => signOut({ callbackUrl: "/auth" })}
      >
        Logout
      </Button>
    </div>
  );
}
