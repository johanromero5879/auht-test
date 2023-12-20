import { UserRepository, User } from "@auth/domain";

export type IFindUserByGoogleId = (googleId: string) => Promise<User | null>

export const FindUserByGoogleId = (userRepository: UserRepository): IFindUserByGoogleId => {
    return async (googleId) => {
        return await userRepository.findByGoogleId(googleId)
    }
}