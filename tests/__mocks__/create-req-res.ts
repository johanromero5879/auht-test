import { Request, Response, NextFunction } from "express"

export const createMockReqAndRes = () => {
    const req = {} as Request;
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    } as unknown as Response;
    const next: NextFunction = jest.fn()

    return { req, res, next }
}