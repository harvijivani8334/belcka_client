import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import api from "@/utils/axios";
import toast from "react-hot-toast";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { loginType } from "@/app/(DashboardLayout)/types/auth/auth";

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const queryParams = new URLSearchParams(window.location.search);
  const inviteToken = queryParams.get("invite");

  // Resend OTP
  const resendOtp = async () => {
    try {
      setLoading(true);
      setShowVerification(true);

      const payload = {
        email,
        invite_link: inviteToken ?? null,
      };

      const response = await api.post(
        "company-clients/send-otp-login",
        payload
      );
      toast.success(response.data.message);
      setCountdown(30);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Unknown error";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter email.");
      return;
    }

    const payload = {
      email,
      otp,
      is_web: true,
      invite_link: inviteToken ?? null,
    };

    try {
      setLoading(true);

      if (!showVerification) {
        const response = await api.post(
          "company-clients/send-otp-login",
          payload
        );
        toast.success(response.data.message);
        setShowVerification(true);
        setCountdown(30);
        return;
      }

      if (!otp.trim()) {
        toast.error("Please enter the verification code.");
        return;
      }

      const result = await signIn("credentials", {
        redirect: false,
        ...payload,
        callbackUrl: "/apps/projects/list",
      });

      if (result?.ok) {
        window.location.href = "/apps/projects/list";
        toast.success("Logged in successfully!!");
      } else {
        if (result?.error) {
          toast.error(result.error);
        }
      }
    } catch (error: any) {
      // const message =
      //   error?.response?.data?.message || error?.message || "Login failed";
      // toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEmail(value);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {title && (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      )}
      {subtext}

      <form onSubmit={handleLogin}>
        <Box sx={{ width: "100%" }}>
          <CustomFormLabel htmlFor="phone">
            What&apos;s your email?
          </CustomFormLabel>

          <CustomTextField
            id="email"
            name="email"
            placeholder="Enter email.."
            value={email}
            onChange={handleChange}
            className="email_wrapper"
          />
        </Box>

        {showVerification && (
          <Box mt={2}>
            <CustomFormLabel htmlFor="code">
              Enter Verification Code
            </CustomFormLabel>
            <CustomTextField
              id="code"
              type="text"
              fullWidth
              value={otp}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                if (/^\d{0,6}$/.test(value)) {
                  setOtp(value);
                }
              }}
              inputProps={{
                maxLength: 6,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />

            <Stack direction="row" justifyContent="space-between" mt={1}>
              <Typography variant="body2" color="textSecondary">
                {countdown > 0
                  ? `Resend in 00:${countdown < 10 ? "0" : ""}${countdown}`
                  : "Didn’t get the code?"}
              </Typography>
              {countdown === 0 && (
                <Typography
                  variant="body2"
                  sx={{
                    cursor: "pointer",
                    color: "primary.main",
                    fontWeight: 500,
                  }}
                  onClick={resendOtp}
                >
                  Resend Now
                </Typography>
              )}
            </Stack>
          </Box>
        )}

        <Box my={2}>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : showVerification
              ? "Verify & Continue"
              : "Continue"}
          </Button>
        </Box>
      </form>
      {subtitle}
    </Box>
  );
};

export default AuthLogin;
