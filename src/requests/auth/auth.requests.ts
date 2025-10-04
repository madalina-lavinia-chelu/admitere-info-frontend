import { LoginFormValues } from "@/app/auth/login/config";
import {
  RequestResetFormValues,
  ResetPasswordFormValues,
} from "@/app/auth/reset-password/config";
import { ApiResponseType } from "@/types/types";
import { ApiResponse } from "@/utils/api.utils";
import axiosInstance from "@/utils/axios";

export const loginUserRequest = async (
  payload: LoginFormValues
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/user/login", {
      ...payload,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const signupUserRequest = async (payload: {
  password: string;
  email: string;
  first_name: string;
  last_name: string;
}): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/user/register", {
      ...payload,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const logoutUserRequest = async (): Promise<ApiResponseType> => {
  try {
    const hasToken =
      axiosInstance?.defaults?.headers?.common &&
      axiosInstance?.defaults?.headers?.common.Authorization;

    if (!hasToken) {
      return ApiResponse.success({
        error: false,
        message: "User is not logged in",
      });
    }

    const response = await axiosInstance.post("/user/logout");

    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const getCurrentUserRequest = async (): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/user/me");

    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const requestPasswordReset = async (
  payload: RequestResetFormValues
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/user/password/reset/request", {
      ...payload,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const resetPassword = async (
  payload: ResetPasswordFormValues
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/user/password/reset", {
      ...payload,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const requestPasswordResetRequest = async (
  payload: RequestResetFormValues
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/user/request-password-reset", {
      ...payload,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const resetPasswordRequest = async (
  payload: ResetPasswordFormValues
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/user/reset-password", {
      ...payload,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const verifyEmailRequest = async (
  token: string,
  userId: string | number
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/user/verify-email", {
      token,
      user: userId,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const resendVerificationEmailRequest = async (
  email: string
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post(
      "/user/resend-verification-email",
      {
        email,
      }
    );
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};
