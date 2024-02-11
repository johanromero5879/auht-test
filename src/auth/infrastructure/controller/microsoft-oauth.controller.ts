import { AuthenticationError } from "@shared/errors";
import { Controller } from "@shared/infrastructure/controller";
import { setRefreshTokenCookie } from "@auth/infrastructure/cookie-utils";

import type { 
    MicrosoftService,
    IFindUserByMicrosoftId,
    IRegisterMicrosoftUser,
    TokenService
} from "@auth/application";

interface MSOAuthControllerParams {
    microsoftService: MicrosoftService
    findUserByMicrosoftId: IFindUserByMicrosoftId
    registerMicrosoftUser: IRegisterMicrosoftUser
    tokenService: TokenService
    clientUrl: string
}

export const MSOAuthController = ({
    microsoftService,
    findUserByMicrosoftId,
    registerMicrosoftUser,
    tokenService,
    clientUrl
}: MSOAuthControllerParams): Controller => {
    return async (req, res, next) => {
        try {
            // Sent code by microsoft
            const code = req.query.code as string
            if (!code) throw new AuthenticationError("Code query is missing") 
            
            const profile = await microsoftService.getProfile(code)

            let user = await findUserByMicrosoftId(profile.id)
            
            // Register a user if they do not exist
            if (!user) {
                user = await registerMicrosoftUser({
                    microsoft_id: profile.id,
                    email: profile.email
                })
            }

            // Create token credentials
            const { access_token, refresh_token } = tokenService.generateTokens(user.id)
            setRefreshTokenCookie(res, refresh_token)

            // Redirect to the client sending access token through query params
            const redirectUrl = `${clientUrl}?token=${access_token}`
            res.redirect(redirectUrl)
        } catch (err) {
            next(err)
        }
    }
}