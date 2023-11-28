interface Response {
    success: boolean
}

export interface SuccessResponse<T> extends Response {
    data: T
}

export interface ErrorBody {
    code?: string,
    message: string
}

export interface ErrorResponse extends Response {
    error: ErrorBody
}