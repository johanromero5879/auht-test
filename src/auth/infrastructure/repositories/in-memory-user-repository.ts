import { randomUUID } from "crypto"

import { User, UserIn, UserOut, UserRepository } from "@auth/domain"

export class InMemoryUserRepository implements UserRepository {
    constructor(
        private users: User[] = []
    ){} 

    async save(user: UserIn) {
        this.users.push({
            id: randomUUID(),
            ...user
        })
    }

    findByEmail(email: string): Promise<UserOut | null>
    findByEmail(email: string, showPassword: boolean): Promise<User | null>
    async findByEmail(email: string, showPassword: boolean = false): Promise<UserOut | User | null> {
        const users = this.users.filter(user => user.email === email)
        if (users.length === 0) return null

        if (showPassword) {
            return {
                id: users[0].id,
                email: users[0].email,
                password: users[0].password
            }
        }

        return {
            id: users[0].id,
            email: users[0].email
        }
    }
}