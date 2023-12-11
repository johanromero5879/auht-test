import { randomUUID } from "crypto"

import { 
    User, 
    UserWithCredentials,
    SignupUser, 
    UserRepository, 
    PasswordUser
} from "@auth/domain"

export class InMemoryUserRepository implements UserRepository {
    constructor(
        private users: UserWithCredentials[] = []
    ){} 

    async save(user: SignupUser) {
        const newUser = {
            id: randomUUID(),
            ...user
        }

        this.users.push(newUser)

        return (({ id, email }) => ({ id, email }))(newUser)
    }

    findByEmail(email: string): Promise<User | null>
    findByEmail(email: string, showPassword: boolean): Promise<PasswordUser | null>
    async findByEmail(email: string, showPassword: boolean = false): Promise<User | PasswordUser | null> {
        const user = this.users.filter(user => user.email === email)[0]

        if (!user) return null
        if (showPassword) return user

        return {
            id: user.id,
            email: user.email
        }
    }

    async findById(id: string): Promise<User | null> {
        const user = this.users.filter(user => user.id === id)[0]
        if (!user) return null

        return {
            id: user.id,
            email: user.email
        }
    }
}