import { UserIn } from "./types";
import { ValidationError } from "@shared/errors"

export const validateUser = (user: UserIn) => {
    validateEmail(user.email)
    validatePassword(user.password)
}

const validateEmail = (email: string) => {
    if (!email) throw new ValidationError(`Email is required`)
    
    // Basic email validation using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ValidationError("Email is not valid")
    }
}

const validatePassword = (password: string) => {
    const minLength = 8
    const maxLength = 16

    if (!password) throw new ValidationError(`Password is required`)

    // Minimum and maximum length required
    if (password.length < minLength || password.length > maxLength) {
        throw new ValidationError(`Password must be between ${minLength} and ${maxLength} characters`)
    }

    // One uppercase letter, one lowercase letter, and one digit
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
        throw new ValidationError("Password must contain at least one uppercase letter, one lowercase letter, and one digit")
    }
}