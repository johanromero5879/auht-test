import { container } from "@container/index";
import { Controller } from "@shared/infrastructure/controller";
import { createRandomSignupUser } from "@tests/auth/__mocks__";
import { IRegisterUser, type TokenService } from "@auth/application";
import { errorHandlerMiddleware } from "@shared/infrastructure/response-handler";
import { createMockReqAndRes, getBodyFromMockedRes, getErrorFromMockedNext } from "@tests/__mocks__";
import { User } from "@auth/domain";

describe("auth: refresh token", () => {

    const tokenService = container.auth.resolve<TokenService>("TokenService")
    const registerUser = container.auth.resolve<IRegisterUser>("RegisterUser")
    const refreshTokenController = container.auth.resolve<Controller>("RefreshTokenController")

    let user: User

    beforeAll(async () => {
        const newUser = createRandomSignupUser()
        user = await registerUser(newUser)
    })

    test("should return a response with a new access token", async () => {
        const { req, res, next } = createMockReqAndRes()
        req.cookies = { 
            refresh_token: tokenService.generateRefreshToken(user.id) 
        }
        
        await refreshTokenController(req, res, next)
        const body = getBodyFromMockedRes(res)

        expect(body.success).toBeTruthy()
        expect(body.data).toHaveProperty("access_token")
    })

    test("should return an error response when refresh token is missing", async () => {
        const { req, res, next } = createMockReqAndRes()

        await refreshTokenController(req, res, next)

        expect(next).toHaveBeenCalled()
        const error = getErrorFromMockedNext(next)
        errorHandlerMiddleware(error, req, res, next)

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: {
                message: "Refresh token is required"
            }
        })
    })

    test("should return an error response when refresh token is invalid", async () => {
        const { req, res, next } = createMockReqAndRes()
        req.cookies = { refresh_token: "<INVALID_TOKEN>" }

        await refreshTokenController(req, res, next)

        expect(next).toHaveBeenCalled()
        const error = getErrorFromMockedNext(next)
        errorHandlerMiddleware(error, req, res, next)

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: {
                message: "Invalid refresh token"
            }
        })
    })
})