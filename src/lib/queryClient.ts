import { QueryClient } from "@tanstack/react-query";

import { HttpError } from "@/lib";

export const QUERY_CLIENT = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) =>
        failureCount < 2 &&
        !(
          error instanceof HttpError &&
          error.status >= 400 &&
          error.status < 500 &&
          error.status !== 429
        ),
    },
  },
});
