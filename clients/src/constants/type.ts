export type UserRole = 'ADMIN' | 'SUPER_ADMIN' | 'EMPLOYEE';


export type ApiSuccessResponse<T> = {
  status: 'success';
  result: T;
  errors: [];
}

export type ApiErrorResponse = {
  status: 'error';
  result: null;
  errors: string[];
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

