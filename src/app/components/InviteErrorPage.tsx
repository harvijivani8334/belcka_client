"use client";

import { Button, Paper, Typography, Box } from "@mui/material";

interface InviteErrorPageProps {
  onLogout: () => void;
}

export default function InviteErrorPage({ onLogout }: InviteErrorPageProps) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="50vh"
      bgcolor="#f9f9f9"
    >
      <Paper sx={{ p: 6, textAlign: "center", borderRadius: 2, maxWidth: 500 }}>
        <Typography variant="h4" color="error" gutterBottom>
          ⚠️ Incorrect login link
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          You are logged in through a different link.
          <br />
          Please log out and log in again using your assigned link and
          credentials.
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
}
