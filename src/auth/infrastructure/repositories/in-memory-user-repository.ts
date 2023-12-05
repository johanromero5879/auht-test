import { randomUUID } from "crypto"

import { User, UserIn, UserOut, UserRepository } from "@auth/domain"

export class InMemoryUserRepository implements UserRepository {
    constructor(
        private users: User[] = []
    ){} 

    async save(user: UserIn) {
        const newUser = {
            id: randomUUID(),
            ...user
        }

        this.users.push(newUser)

        return (({ password, ...user }) => user)(newUser)
    }

    findByEmail(email: string): Promise<UserOut | null>
    findByEmail(email: string, showPassword: boolean): Promise<User | null>
    async findByEmail(email: string, showPassword: boolean = false): Promise<UserOut | User | null> {
        const users = this.users.filter(user => user.email === email)
        if (users.length === 0) return null

        if (showPassword) return users[0]

        return (({ password, ...user }) => user)(users[0])
    }

    async findById(id: string): Promise<UserOut | null> {
        const users = this.users.filter(user => user.id === id)
        if (users.length === 0) return null

        return (({ password, ...user }) => user)(users[0])
    }
}