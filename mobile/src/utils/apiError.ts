import axios from "axios";

type ErrorBody = {
  error?: unknown;
};

export function getApiErrorMessage(e: unknown, fallback: string): string {
  if (axios.isAxiosError(e)) {
    const data = e.response?.data as ErrorBody | undefined;
    const msg = typeof data?.error === "string" ? data.error : undefined;

    if (msg) {
      return msg;
    }

    if (e.response) {
      const status = e.response.status;
      return `Request failed (${status})`;
    }

    if (typeof e.message === "string" && e.message.trim().length > 0) {
      return e.message;
    }

    return fallback;
  }

  if (e instanceof Error && e.message.trim().length > 0) {
    return e.message;
  }

  return fallback;
}
