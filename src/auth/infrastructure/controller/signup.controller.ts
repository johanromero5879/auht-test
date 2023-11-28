import { Request, Response, NextFunction } from "express"

import { IRegisterUser } from "@auth/application"
import { handleSuccess } from "@shared/infrastructure/response-handler"

export const SignupController = (registerUser: IRegisterUser) => {

    return async (req: Request, res: Response, next: NextFunction) => {
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
