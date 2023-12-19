import { UserRepository, User } from "@auth/domain";
import { NotFoundError } from "@shared/errors";

export type IFindUserById = (id: string) => Promise<User>

export const FindUserById = (userRepository: UserRepository): IFindUserById => {
    return async (id) => {
        const user = await userRepository.findById(id)

        if (!user) throw new NotFoundError(`User id ${id} not found`)

        return user
    }
}