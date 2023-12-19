import { Controller } from "@shared/infrastructure/controller"
import { IRegisterUser, TokenService } from "@auth/application"
import { handleSuccess } from "@shared/infrastructure/response-handler"
import { setRefreshTokenCookie } from "@auth/infrastructure/cookie-utils"

export const SignupController = (
    registerUser: IRegisterUser,
    tokenService: TokenService
): Controller => {

    return async (req, res, next) => {
        try {
            const { email, password } = req.body
            const user = await registerUser({ email, password })

            const { access_token, refresh_token } = tokenService.generateTokens(user.id)
            setRefreshTokenCookie(res, refresh_token)
            
            const data = { user, access_token }
            handleSuccess(res, data, 201)
        } catch (err) {
            next(err)
        }
    }

}
