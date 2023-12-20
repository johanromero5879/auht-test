import { JwtPayload, decode } from "jsonwebtoken"
import { AuthenticationError } from "@shared/errors"

interface GoogleServiceParams {
    clientId: string
    clientSecret: string
    redirectUri: string
}

export interface GoogleProfile {
    id: string
    email: string
    email_verified: boolean
    name: string
    given_name: string
    family_name: string
    picture: string
    locale: string
}

export class GoogleService {
    constructor(
        private config: GoogleServiceParams
    ) {}
    
    getRedirectUri(): string {
        const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth"
        const options = {
            redirect_uri: this.config.redirectUri,
            client_id: this.config.clientId,
            access_type: "offline",
            response_type: "code",
            prompt: "consent",
            scope: "profile email"
        }

        const query = new URLSearchParams(options)
        const redirectUri = `${rootUrl}?${query}`
        
        return redirectUri
    }

    async getProfile(authorizationCode: string) {
        const { id_token } = await this.getOAuthTokens(authorizationCode)

        // Decode id_token with jwt to extract profile data
        const decodedToken = decode(id_token) as JwtPayload
        const profile = this.extractProfileFromIdToken(decodedToken)

        return profile
    }

    private async getOAuthTokens(authorizationCode: string) {
        const url = "https://oauth2.googleapis.com/token"
        const body = {
            code: authorizationCode,
            client_id: this.config.clientId,
            client_secret: this.config.clientSecret,
            redirect_uri: this.config.redirectUri,
            grant_type: "authorization_code"
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        const data = await response.json()
        if (data.error) throw new AuthenticationError("Unauthenticated by Google")

        return {
            id_token: data.id_token,
            access_token: data.access_token
        }
    }

    private extractProfileFromIdToken (idToken: JwtPayload): GoogleProfile {
        const { iss, azp, aud, sub, at_hash, iat, exp, ...profile } = idToken
        return { id: sub, ...profile } as GoogleProfile
    }
} 