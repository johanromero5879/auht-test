import { GoogleService } from "@auth/application";
import { Controller } from "@shared/infrastructure/controller";

export const RedirectGoogleOAuthController = (googleService: GoogleService): Controller => {
    return async (req, res, next) => {
        const redirectUri = googleService.getRedirectUri()
        res.redirect(redirectUri)
    }
}