import { BaseError } from "./BaseError"

export class AuthenticationError extends BaseError {
    constructor(message: string) {
        super({
            message,
            status: 401 // Unauthorized
        })
    }
}