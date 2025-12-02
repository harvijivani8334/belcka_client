import axios from "axios";
import { getSession } from "next-auth/react";
import toast from "react-hot-toast";
import { logoutWithInviteRedirect } from "@/utils/logout";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if ((session as any)?.accessToken) {
      config.headers = config.headers || {};
      config.headers["authorization"] = `Bearer ${(session as any).accessToken}`;
      config.headers["is_web"] = `true`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      logoutWithInviteRedirect();
      return;
    }

    toast.error(error.response?.data?.message);
    return Promise.reject(error);
  }
);

export default api;
