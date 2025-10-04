import { ApiResponseType } from "../types/types";

export const ApiResponse = {
  success: (response: any): ApiResponseType => response,
  error: (error: any | string): ApiResponseType => {
    // Server error (500+)
    if (error.response && error.response.status >= 500) {
      return {
        error: true,
        message: "A apărut o eroare! Vă rugăm reîncercați mai târziu.",
      };
    }

    // If we have a response with data from the server (including validation errors)
    if (error.response && error.response.data) {
      // Return the server's error response directly
      return error.response.data;
    }

    // Fallback for other errors
    return {
      error: true,
      message: typeof error === "string" ? error : error.message,
    };
  },
};

export const withoutRevalidateOnFocus = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 0,
};

export const withRevalidateOnMount = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 0,
  revalidateOnMount: true,
  errorRetryCount: 3,
  shouldRetryOnError: true,
  dedupingInterval: 2000, // Prevent duplicate requests within 2 seconds
};
