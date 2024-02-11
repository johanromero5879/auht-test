import { DuplicateError } from "@shared/errors"
import { UserRepository, User, MicrosoftUser } from "@auth/domain";

export type IRegisterMicrosoftUser = (user: MicrosoftUser) => Promise<User>

export const RegisterMicrosoftUser = (userRepository: UserRepository): IRegisterMicrosoftUser => {
    return async (user) => {
        // Clone the user object to avoid side effects with hash password
        user = {...user}

        const userFound = await userRepository.findByEmail(user.email)
        if (userFound) throw new DuplicateError("Email is already registered")

        return await userRepository.save(user)
    }
}