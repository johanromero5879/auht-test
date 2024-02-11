import { JwtPayload, decode } from "jsonwebtoken"
import { AuthenticationError } from "@shared/errors"

interface MSServiceParams {
    clientId: string
    tenantId: string
    clientSecret: string
    redirectUri: string
}

export interface MicrosoftProfile {
    id: string
    email: string
    name: string
    given_name: string
    family_name: string
}

export class MicrosoftService {
    private scope: string = "User.Read"
    private endpoint: string

    constructor(
        private config: MSServiceParams
    ) { 
        this.endpoint = `https://login.microsoftonline.com/${ this.config.tenantId }/oauth2/v2.0`
    }
    
    getRedirectUri(): string {
        const rootUrl = `${ this.endpoint }/authorize`
        const options = {
            client_id: this.config.clientId,
            response_type: "code",
            redirect_uri: this.config.redirectUri,
            response_mode: "query",
            scope: this.scope,
            prompt: "consent",
        }

        const query = new URLSearchParams(options)
        const redirectUri = `${rootUrl}?${query}`
        
        return redirectUri
    }

    async getProfile(authorizationCode: string) {
        const { access_token } = await this.getOAuthTokens(authorizationCode)

        // Decode access_token with jwt to extract profile data
        const decodedToken = decode(access_token) as JwtPayload
        const profile = this.extractProfileFromAccessToken(decodedToken)

        return profile
    }

    private async getOAuthTokens(authorizationCode: string) {
        const url = `${ this.endpoint }/token`
        
        const formData = {
            client_id: this.config.clientId,
            scope: this.scope,
            code: authorizationCode,
            redirect_uri: this.config.redirectUri,
            grant_type: "authorization_code",
            client_secret: this.config.clientSecret,
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(formData).toString()
        })

        const data = await response.json()
        if (data.error) throw new AuthenticationError("Unauthenticated by Microsoft")

        return {
            access_token: data.access_token
        }
    }

    private extractProfileFromAccessToken (accessToken: JwtPayload): MicrosoftProfile {
        const { oid, email, name, given_name, family_name } = accessToken
        return { id: oid, email, name, given_name, family_name }
    }
}