import { User, SignupUser, PasswordUser } from "./types"

export interface UserRepository {
    save(user: SignupUser): Promise<User>

    findByEmail(email: string): Promise<User | null>
    findByEmail(email: string, showPassword: boolean): Promise<PasswordUser | null>

    findById(id: string): Promise<User | null>
    findByGoogleId(googleId: string): Promise<User | null>
}