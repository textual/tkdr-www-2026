"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export async function authenticatedFetch(url, options = {}) {
  const originalRequest = { url, options };
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (accessToken) {
    originalRequest.options.headers = {
      ...originalRequest.options.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  try {
    const response = await fetch(originalRequest.url, originalRequest.options);

    // If the token is expired, trigger the refresh logic
    if (response.status === 403) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.options.headers.Authorization = `Bearer ${token}`;
          return authenticatedFetch(
            originalRequest.url,
            originalRequest.options
          );
        });
      }

      isRefreshing = true;

      // Check if another refresh is already in progress
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.options.headers = {
            ...originalRequest.options.headers,
            Authorization: `Bearer ${token}`,
          };
          return authenticatedFetch(
            originalRequest.url,
            originalRequest.options
          );
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${process.env.AUTH_SERVER_URL}/auth/refresh`,
          { refreshToken }
        );
        const newAccessToken = refreshResponse.data.accessToken;

        originalRequest.options.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        return authenticatedFetch(originalRequest.url, originalRequest.options);
      } catch (refreshError) {
        processQueue(refreshError, null);
        cookies().delete("access_token");
        cookies().delete("refresh_token");
        redirect("/login");
      } finally {
        isRefreshing = false;
      }
    }
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}
