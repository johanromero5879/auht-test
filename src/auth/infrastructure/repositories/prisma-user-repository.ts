import type { PrismaClient } from "@prisma/client"

import { prisma } from "@shared/infrastructure/prisma"
import { UserIn, UserOut, UserRepository, User} from "@auth/domain";

export class PrismaUserRepository implements UserRepository {
    private prisma: PrismaClient

    constructor() {
        this.prisma = prisma
    }

    async save(user: UserIn): Promise<UserOut> {
        const newUser = await this.prisma.user.create({ 
            data: user,
            select: { id: true, email: true }
        }) 

        return newUser
    }

    findByEmail(email: string): Promise<UserOut | null>
    findByEmail(email: string, showPassword: boolean): Promise<User | null>
    async findByEmail(email: string, showPassword: boolean = false): Promise<UserOut | User | null> {

        const userFound = this.prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, password: showPassword}
        })

        return userFound
    }
}