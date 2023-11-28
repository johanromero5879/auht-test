import { BaseError } from "./BaseError"

export class DuplicateError extends BaseError {
    constructor(message: string) {
        super({ 
            message, 
            status: 409 // Conflict
        })
    }
}