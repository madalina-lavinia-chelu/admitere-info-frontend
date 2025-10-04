import { updateProfileFormValues } from "@/app/dashboard/profile/config";
import { UpdateUserFormValues } from "@/app/dashboard/user/edit/config";
import { ApiResponseType, QuestionsSearchPayloadType } from "@/types/types";
import { ApiResponse } from "@/utils/api.utils";
import axiosInstance from "@/utils/axios";

export const getAllUsersRequest = async (
  payload: QuestionsSearchPayloadType
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/user/get-all", {
      ...payload,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const toggleActiveStatusRequest = async (
  id: number
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/user/toggle-active-status", {
      id,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const updateProfileRequest = async (
  payload: updateProfileFormValues
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/user/update-profile", payload);
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const updateUserRequest = async (
  payload: UpdateUserFormValues
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/user/update-user", payload);
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const getRolesRequest = async (): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/user/get-roles");
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};
