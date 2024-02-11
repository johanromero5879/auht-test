import { MicrosoftService } from "@auth/application";
import { Controller } from "@shared/infrastructure/controller";

export const RedirectMicrosoftOAuthController = (microsoftService: MicrosoftService): Controller => {
    return async (req, res, next) => {
        const redirectUri = microsoftService.getRedirectUri()
        res.redirect(redirectUri)
    }
}