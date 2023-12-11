import { UserRepository, User } from "@auth/domain";
import { NotFoundError } from "@shared/errors";

export type IFindUserById = (id: string) => Promise<User>

export const FindUserById = (userRepository: UserRepository) => {
    return async (id: string) => {
        const user = await userRepository.findById(id)

        if (!user) throw new NotFoundError(`User id ${id} not found`)

        return user
    }
}