/** Envelope returned by every internal Route Handler. */
export type ApiSuccess<T> = { data: T };

export type ApiFailure = {
  error: {
    code: string;
    message: string;
    issues?: Record<string, string>;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
