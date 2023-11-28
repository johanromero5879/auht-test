import type { PrismaClient } from "@prisma/client"

import { prisma } from "@shared/infrastructure/prisma"
import { UserIn, UserOut, UserRepository} from "@auth/domain";

export class PrismaUserRepository implements UserRepository {
    private prisma: PrismaClient

    constructor() {
        this.prisma = prisma
    }

    async save(user: UserIn): Promise<void> {
        await this.prisma.user.create({ data: user }) 
    }

    async findByEmail(email: string): Promise<UserOut | null> {
        const userFound = this.prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true }
        })

        return userFound
    }
    
}