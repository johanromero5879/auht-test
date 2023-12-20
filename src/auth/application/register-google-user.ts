import { DuplicateError } from "@shared/errors"
import { UserRepository, User, GoogleUser } from "@auth/domain";

export type IRegisterGoogleUser = (user: GoogleUser) => Promise<User>

export const RegisterGoogleUser = (userRepository: UserRepository): IRegisterGoogleUser => {
    return async (user) => {
        // Clone the user object to avoid side effects with hash password
        user = {...user}

        const userFound = await userRepository.findByEmail(user.email)
        if (userFound) throw new DuplicateError("Email is already registered")

        return await userRepository.save(user)
    }
}