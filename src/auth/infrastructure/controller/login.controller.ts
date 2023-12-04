import { Controller } from "@shared/infrastructure/controller"
import { handleSuccess } from "@shared/infrastructure/response-handler"
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
            res.cookie("refresh_token", refresh_token, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === "prod", // Set to true in a production environment (requires HTTPS), 
                maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in miliseconds , 
                sameSite: process.env.NODE_ENV === "prod" ? "strict": "none"
            })

            handleSuccess(res, { access_token })
        } catch (err) {
            next(err)
        }
    }
}