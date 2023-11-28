interface BaseErrorParams {
    message: string,
    code?: string,
    status?: number
}

export class BaseError extends Error {
    readonly code?: string
    readonly status?: number
    
    constructor({ message, code, status }: BaseErrorParams) {
        super(message)
        this.code = code
        this.status = status
    }
}