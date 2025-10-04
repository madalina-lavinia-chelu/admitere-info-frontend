import { QuestionFormValues } from "@/app/dashboard/question/config";
import { ApiResponseType, QuestionsSearchPayloadType } from "@/types/types";
import { ApiResponse } from "@/utils/api.utils";
import axiosInstance from "@/utils/axios";

export const upsertQuestionRequest = async (
  payload: QuestionFormValues
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/question/upsert", {
      ...payload,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const getAllQuestionsRequest = async (
  payload: QuestionsSearchPayloadType
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/question/get-all", {
      ...payload,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const deleteQuestionRequest = async (
  id: number
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/question/delete-question", {
      id,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const getDifficultiesRequest = async (): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/question/get-difficulties");
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const getChaptersRequest = async (): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/question/get-chapters");
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const getSourcesRequest = async (): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/question/get-sources");
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const upsertSourceRequest = async (
  payload: { id?: number; name: string; description?: string }
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/question/upsert-source", {
      ...payload,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const upsertChapterRequest = async (
  payload: {
    id?: number;
    name: string;
    parent_id?: number;
    order?: number;
    description?: string;
  }
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/question/upsert-chapter", {
      ...payload,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const deleteSourceRequest = async (
  id: number
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/question/delete-source", {
      id,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const deleteChapterRequest = async (
  id: number
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/question/delete-chapter", {
      id,
    });
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};
