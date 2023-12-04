import { Request, Response, NextFunction } from "express"

import { BaseError } from "@shared/errors"
import { SuccessResponse, ErrorResponse, ErrorBody } from "./response"

export const handleSuccess = <T>(
    res: Response<SuccessResponse<T>>,
    data: T,
    status: number = 200
) => {
    res.status(status).json({
        success: true,
        data
    })
}

export const handleError = (
    res: Response<ErrorResponse>,
    error: ErrorBody,
    status: number = 400,
) => {
    res.status(status).json({
        success: false,
        error
    })
}

export const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    let status = 500 // Internal Server Error
    const errorBody: ErrorBody = { message: "Ups! Something went wrong" }
    
    if (err instanceof BaseError) {
        errorBody.message = err.message
        if (err.status) status = err.status
        if (err.code) errorBody.code = err.code
    } else {
        console.error(err)
    }

    handleError(res, errorBody, status)
}