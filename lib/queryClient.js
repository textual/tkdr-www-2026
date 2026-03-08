import { QueryClient } from "@tanstack/react-query";

/**
 * A single QueryClient instance shared across the app.
 *
 * Retry config is intentionally generous here because the API server
 * is on a free tier and may need 10–20 seconds to cold-start.
 * The exponential backoff means retries go at roughly:
 *   1s → 2s → 4s → 8s → 16s
 * ...giving the server ~30s total to wake up before we give up.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 5,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 16000),
      // Keep successful app/info response fresh for the whole session.
      // No need to re-fetch unless the user refreshes the page.
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});
