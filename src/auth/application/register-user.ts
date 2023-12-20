import { hashPassword } from "./hash-service"
import { DuplicateError } from "@shared/errors"
import { UserRepository, User, validateUser, PasswordUserIn } from "@auth/domain";

export type IRegisterUser = (user: PasswordUserIn) => Promise<User>

export const RegisterUser = (userRepository: UserRepository): IRegisterUser => {
    return async (user: PasswordUserIn) => {
        // Clone the user object to avoid side effects with hash password
        user = {...user}
        
        validateUser(user)

        const userFound = await userRepository.findByEmail(user.email)
        if (userFound) throw new DuplicateError("Email is already registered")

        user.password = await hashPassword(user.password)

        return await userRepository.save(user)
    }
}