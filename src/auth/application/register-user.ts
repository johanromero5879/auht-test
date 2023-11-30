import { hashPassword } from "./hash-service"
import { DuplicateError } from "@shared/errors"
import { UserRepository, UserIn, validateUser } from "@auth/domain";

export type IRegisterUser = (user: UserIn) => Promise<void>

export const RegisterUser = (userRepository: UserRepository): IRegisterUser => {
    return async (user: UserIn) => {
        // Clone the user object to avoid side effects with hash password
        user = {...user}

        validateUser(user)

        const userFound = await userRepository.findByEmail(user.email)
        if (userFound) throw new DuplicateError("Email is already registered")

        user.password = await hashPassword(user.password)

        await userRepository.save(user)
    }
}