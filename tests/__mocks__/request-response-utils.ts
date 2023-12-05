import request from "supertest"
import { Request, Response, NextFunction, Express } from "express"

export const createMockReqAndRes = () => {
    const req = {
        cookies: {}
    } as Request;

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        cookie: jest.fn(),
        clearCookie: jest.fn()
    } as unknown as Response;

    const next: NextFunction = jest.fn()

    return { req, res, next }
}

export const getBodyFromMockedRes = (res: Response) => (res.json as jest.Mock).mock.calls[0][0]
export const getErrorFromMockedNext = (next: NextFunction) => (next as jest.Mock).mock.calls[0][0]

export const makeMockPostRequest = async ({app, endpoint, body, status}: {
    app: Express,
    endpoint: string, 
    body: any, 
    status: number
}) => {
    return await request(app)
                    .post(endpoint)
                    .send(body)
                    .expect("Content-Type", /json/)
                    .expect(status)
}