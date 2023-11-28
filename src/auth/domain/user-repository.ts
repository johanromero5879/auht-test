import { UserIn, UserOut } from "./types"

export interface UserRepository {
    save(user: UserIn): Promise<void>
    findByEmail(email: string): Promise<UserOut | null>
}