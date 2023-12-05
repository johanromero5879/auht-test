import { UserIn, UserOut, User } from "./types"

export interface UserRepository {
    save(user: UserIn): Promise<UserOut>

    findByEmail(email: string): Promise<UserOut | null>
    findByEmail(email: string, showPassword: boolean): Promise<User | null>

    findById(id: string): Promise<UserOut | null>
}