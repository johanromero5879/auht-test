import { sign, verify, JwtPayload } from "jsonwebtoken"

import { AuthenticationError } from "@shared/errors"

export class TokenService {
    constructor(
        private readonly secretKey: string
    ) {}

    generateTokens(userId: string) {
        return {
            access_token: this.generateAccessToken(userId),
            refresh_token: this.generateRefreshToken(userId)
        }
    }

    generateAccessToken(userId: string) {
        const payload = { sub: userId }

        return sign(payload, this.secretKey, { expiresIn: "15min" })
    }

    generateRefreshToken(userId: string) {
        const payload = { sub: userId }

        return sign(payload, this.secretKey, { expiresIn: "1d" })
    }

    verifyToken(token: string): string {
        try {
            const { sub } = verify(token, this.secretKey) as JwtPayload
            return sub!
        } catch {
            throw new AuthenticationError("Invalid refresh token")
        }
        
    }
}