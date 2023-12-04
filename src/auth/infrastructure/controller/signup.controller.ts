import { IRegisterUser } from "@auth/application"
import { Controller } from "@shared/infrastructure/controller"
import { handleSuccess } from "@shared/infrastructure/response-handler"

export const SignupController = (registerUser: IRegisterUser): Controller => {

    return async (req, res, next) => {
        try {
            const { email, password } = req.body
            await registerUser({ email, password })

            const data = {
                message: "User registered successfully"
            }

            handleSuccess(res, data, 201)
        } catch (err) {
            next(err)
        }
    }

}
