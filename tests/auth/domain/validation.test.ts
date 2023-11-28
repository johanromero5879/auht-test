import { randomBytes } from "crypto"

import { ValidationError } from "@shared/errors"
import { validateUser, UserIn } from "@auth/domain"
import { createRandomSignupUser } from "@tests/auth/__mocks__"

const generateRandomString = (length: number) => {
    return randomBytes(length).toString("hex").substring(0, length)
}

describe("auth: validate user", () => {
    let user: UserIn

    beforeEach(() => {
        user = createRandomSignupUser()
    })

    describe("validate email", () => {
        test("should execute when user data is correct", () => {
            expect(() => validateUser(user))
                .not.toThrow()
        })
    
        test("should throw an error when email is empty", () => {
            user.email = ""
            expect(() => validateUser(user))
                .toThrow(new ValidationError("Email is required"))
        })
    
        test("should throw an error when email is not valid", () => {
            user.email = "asasa@asas."
            expect(() => validateUser(user))
                .toThrow(new ValidationError("Email is not valid"))
        })
    })

    describe("validate password", () => {
        test("should throw an error when password is empty", () => {
            user.password = ""
            expect(() => validateUser(user))
                .toThrow(new ValidationError("Password is required"))
        })
    
        test("should throw an error when password does not meet min and max length", () => {
            const min = 8
            const max = 16
            const error = new ValidationError(`Password must be between ${min} and ${max} characters`)
    
            user.password = generateRandomString(7)
            expect(() => validateUser(user))
                .toThrow(error)
    
            user.password = generateRandomString(20)
            expect(() => validateUser(user))
                .toThrow(error)
        })
    
        test("should throw an error when password is not valid", () => {
            user.password = generateRandomString(10)
            expect(() => validateUser(user))
                .toThrow(new ValidationError("Password must contain at least one uppercase letter, one lowercase letter, and one digit"))
    
        })
    })
})