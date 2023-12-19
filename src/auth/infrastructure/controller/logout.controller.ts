import { Controller } from "@shared/infrastructure/controller"
import { handleSuccess } from "@shared/infrastructure/response-handler"
import { clearRefreshTokenCookie } from "@auth/infrastructure/cookie-utils"

export const LogoutController = (): Controller => {
    return async (req, res, next) => {
        try {
            clearRefreshTokenCookie(res)
            handleSuccess(res)
        } catch (err) {
            next(err)
        }
    }
}