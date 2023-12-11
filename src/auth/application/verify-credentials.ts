import { comparePassword } from "./hash-service"
import { User, UserRepository } from "@auth/domain";
import { AuthenticationError, ValidationError } from "@shared/errors"

export type IVerifyCredentials = (email: string, password: string) => Promise<User>

export const VerifyCredentials = (userRepository: UserRepository): IVerifyCredentials => {
    return async (email: string, password: string) => {

        // Validate non-empty fields
        if (!email) throw new ValidationError("Email is required")
        if (!password) throw new ValidationError("Password is required")

        const errorMessage = "You have entered an invalid email or password"
        
        // Check if email exists
        const userFound = await userRepository.findByEmail(email, true)
        if (!userFound || !userFound.password) throw new AuthenticationError(errorMessage)

        // Check if password matches with the hash saved
        const isMatching = await comparePassword(password, userFound.password)
        if (!isMatching) throw new AuthenticationError(errorMessage)

        // Return user found without password
        return (({ password, ...user }) => user)(userFound) 
    }
}