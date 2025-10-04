import { ApiResponseType } from "@/types/types";
import { ApiResponse } from "@/utils/api.utils";
import axiosInstance from "@/utils/axios";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  description: string;
}

export const submitContactForm = async (
  payload: ContactFormData
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post(
      "/problem-report/submit-contact-form",
      { ...payload }
    );
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export interface ReportIssueData {
  subject: string;
  description: string;
}

export const reportGeneralIssue = async (
  payload: ReportIssueData
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post(
      "/problem-report/report-general-issue",
      {
        ...payload,
      }
    );
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export interface QuestionReportData {
  question_id: number;
  subject: string;
  description: string;
}

export const reportQuestionIssue = async (
  payload: QuestionReportData
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post(
      "/problem-report/report-question-issue",
      {
        ...payload,
      }
    );
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export interface ReportsSearchPayload {
  id?: number;
  page?: number;
  per_page?: number;
  search?: string | null;
  status?: "pending" | "in_progress" | "resolved" | "closed" | "rejected";
  type?: "contact_form" | "question_issue" | "general_app";
  user_id?: number;
  question_id?: number;
}

export const getAllReports = async (
  payload: ReportsSearchPayload
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post(
      "/problem-report/get-all-reports",
      {
        ...payload,
      }
    );
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export interface UpdateReportStatusData {
  id: number;
  status: "pending" | "in_progress" | "resolved" | "closed" | "rejected";
  admin_notes?: string;
}

export const updateReportStatus = async (
  payload: UpdateReportStatusData
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.patch(
      `/problem-report/update-report-status`,
      {
        ...payload,
      }
    );
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};
