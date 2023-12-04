import { sign, verify } from "jsonwebtoken"


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

    verifyToken(token: string) {
        return verify(token, this.secretKey)
    }
}