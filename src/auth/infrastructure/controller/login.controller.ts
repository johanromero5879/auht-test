import { Controller } from "@shared/infrastructure/controller"
import { handleSuccess } from "@shared/infrastructure/response-handler"
import { setRefreshTokenCookie } from "@auth/infrastructure/cookie-utils"
import type { IVerifyCredentials, TokenService } from "@auth/application"


export const LoginController = (
    verifyCredentials: IVerifyCredentials,
    tokenService: TokenService
): Controller => {
    return async (req, res, next) => {
        try {
            const { email, password } = req.body
            const user = await verifyCredentials(email, password)

            const { access_token, refresh_token } = tokenService.generateTokens(user.id)

            // Send refresh token by cookies
            setRefreshTokenCookie(res, refresh_token)

            handleSuccess(res, { user, access_token })
        } catch (err) {
            next(err)
        }
    }
}