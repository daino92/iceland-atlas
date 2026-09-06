import axios from "axios";

const HTTP = axios.create({ timeout: 20_000 });

export const getJson = async <T>(
  url: string,
  signal?: AbortSignal,
): Promise<T> => {
  try {
    const { data } = await HTTP.get<T>(url, { signal });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new HttpError(error.response.status);
    }
    // Preserve cancellation and network errors for React Query.
    throw error;
  }
};

export class HttpError extends Error {
  constructor(public readonly status: number) {
    super(`Request failed (${status})`);
  }
}
