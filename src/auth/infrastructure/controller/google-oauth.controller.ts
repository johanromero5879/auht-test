import { AuthenticationError } from "@shared/errors";
import { Controller } from "@shared/infrastructure/controller";
import { setRefreshTokenCookie } from "@auth/infrastructure/cookie-utils";
import type { 
    IFindUserByGoogleId, 
    GoogleService, 
    IRegisterGoogleUser, 
    TokenService 
} from "@auth/application";

interface GoogleOAuthControllerParams {
    googleService: GoogleService
    findUserByGoogleId: IFindUserByGoogleId
    registerGoogleUser: IRegisterGoogleUser
    tokenService: TokenService,
    clientUrl: string
}

export const GoogleOAuthController = ({
    googleService,
    findUserByGoogleId,
    registerGoogleUser,
    tokenService,
    clientUrl
}: GoogleOAuthControllerParams): Controller => {
    return async (req, res, next) => {
        try {
            // Sent code by google
            const code = req.query.code as string
            if (!code) throw new AuthenticationError("Code query is missing") 
    
            const profile = await googleService.getProfile(code)
            // Check if google email is verified
            if (!profile.email_verified) throw new AuthenticationError("Google email not verified")

            let user = await findUserByGoogleId(profile.id)
            // Register a user if they do not exist
            if (!user) {
                user = await registerGoogleUser({
                    google_id: profile.id,
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