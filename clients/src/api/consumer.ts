import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiErrorResponse, ApiResponse } from "../constants/type";
import type { loginRequest } from "../constants/RequestType";
import type { CurrentAccountResult, LoginResult, UserListResult } from "../constants/ResponseType";

const API_BASE_URL = import.meta.env.VITE_API_URL as string || "http://localhost:8080";
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  async (response: AxiosResponse) => {
    if (import.meta.env.DEV_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const { response } = error;

    if (!response) {
      return Promise.reject({
        message: "Network error. Please check your connection.",
        status: 0,
      });
    }

    const { status, data } = response;
    let message = "Something went wrong. Please try again.";

    switch (status) {
      case 401:
        localStorage.removeItem("jwtToken");
        window.location.href = "/login";
        message = "Session expired. Please log in again.";
        break;

      case 403:
        message = "You do not have permission to access this resource.";
        break;

      case 400:
        if (data?.errors && data.errors.length > 0) {
          message = data.errors.join(", ");
        } else {
          message = "Bad request";
        }
        break;

      case 500:
        message = "Internal server error. Please try again later.";
        break;

      default:
        if (data?.errors && data.errors.length > 0) {
          message = data.errors.join(", ");
        } else {
          message = error.message || message;
        }
        break;
    }

    return Promise.reject({ message, status });
  },
);

const request = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, config).then(responseBody),

  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, body, config).then(responseBody),

  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(url, body, config).then(responseBody),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config).then(responseBody),
};

export const account = {
  login: (body: loginRequest) => request.post<ApiResponse<LoginResult>>('/account/login', body),
  current: () => request.get<ApiResponse<CurrentAccountResult>>('/account/current'),
  resetPassword: (newpwd: string) => request.put<ApiResponse<CurrentAccountResult>>("/account/reset-password", {newPassword: newpwd})
};

export const user = {
    list: () => request.get<ApiResponse<UserListResult>>("/users/list")
}


const consumer = {
  account
};

export default consumer;
