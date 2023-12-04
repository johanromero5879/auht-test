import { Controller } from "@shared/infrastructure/controller"
import { handleSuccess } from "@shared/infrastructure/response-handler"

export const LogoutController = (): Controller => {
    return async (req, res, next) => {
        try {
            res.clearCookie("refresh_token")
            handleSuccess(res)
        } catch (err) {
            next(err)
        }
    }
}