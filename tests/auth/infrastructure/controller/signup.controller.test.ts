import { container } from "@container/index"
import { createMockReqAndRes } from "@tests/__mocks__"
import { createRandomSignupUser } from "@tests/auth/__mocks__"
import { Controller } from "@shared/infrastructure/controller"
import { errorHandlerMiddleware } from "@shared/infrastructure/response-handler"

const signupController = container.auth.resolve<Controller>("SignupController")

describe(`auth: signup controller`, () => {
    const mockUser = createRandomSignupUser()

    test('should return a success response when a new user is registered', async () => {
        const { req, res, next } = createMockReqAndRes()
        req.body = mockUser

        await signupController(req, res, next)

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: {
                message: "User registered successfully"
            }
        });
    })

    test('should return an error response when user data is not valid', async () => {
        const { req, res, next } = createMockReqAndRes()
        req.body = { email: "NotAnEmail", password: "fake123"}

        await signupController(req, res, next)

        // Trigger next when an error occured in the controller
        expect(next).toHaveBeenCalled()

        // Retrieve the error passed to the next function
        const error = (next as jest.Mock).mock.calls[0][0]

        // Call the error middleware with the error
        errorHandlerMiddleware(error, req, res, next)

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: {
                message: "Email is not valid"
            }
        })
    })

    test('should return an error response when it detects a duplicated email', async () => {
        const { req, res, next } = createMockReqAndRes()
        req.body = mockUser

        await signupController(req, res, next)

        // Trigger next when an error occured in the controller
        expect(next).toHaveBeenCalled()

        // Retrieve the error passed to the next function
        const error = (next as jest.Mock).mock.calls[0][0]

        // Call the error middleware with the error
        errorHandlerMiddleware(error, req, res, next)

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: {
                message: "Email is already registered"
            }
        })
    })
})