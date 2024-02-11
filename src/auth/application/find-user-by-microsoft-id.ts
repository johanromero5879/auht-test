import { UserRepository, User } from "@auth/domain";

export type IFindUserByMicrosoftId = (microsoftId: string) => Promise<User | null>

export const FindUserByMicrosoftId = (userRepository: UserRepository): IFindUserByMicrosoftId => {
    return async (microsoftId) => {
        return await userRepository.findByMicrosoftId(microsoftId)
    }
}