import { randomUUID } from "crypto"

import { User, UserIn, UserOut, UserRepository } from "@auth/domain"

export class MockUserRepository implements UserRepository {
    constructor(
        private users: User[] = []
    ){} 

    async save(user: UserIn) {
        this.users.push({
            id: randomUUID(),
            ...user
        })
    }

    async findByEmail(email: string): Promise<UserOut | null> {
        const users = this.users.filter(user => user.email === email)
        if (users.length === 0) return null

        return {
            id: users[0].id,
            email: users[0].email
        }
    }
}