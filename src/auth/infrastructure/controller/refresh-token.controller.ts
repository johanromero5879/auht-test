import { AuthenticationError } from "@shared/errors";
import { Controller } from "@shared/infrastructure/controller";
import type { IFindUserById, TokenService } from "@auth/application";
import { handleSuccess } from "@shared/infrastructure/response-handler";

export const RefreshTokenController = (findUserById: IFindUserById, tokenService: TokenService): Controller => {
    return async (req, res, next) => {
        try {
            const refreshToken = req.cookies?.refresh_token
            if (!refreshToken) throw new AuthenticationError("Refresh token is required")

            const userId = tokenService.verifyToken(refreshToken)
            // Check if user exists
            const userFound = await findUserById(userId)

            const data = {
                access_token: tokenService.generateAccessToken(userFound.id)
            }
    
            handleSuccess(res, data, 201)
        } catch (err){
            next(err)
        }
    }
}