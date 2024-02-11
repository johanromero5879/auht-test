import type { PrismaClient } from "@prisma/client"

import { prisma } from "@shared/infrastructure/prisma"
import { UserRepository, User, SignupUser, PasswordUser } from "@auth/domain";

export class PrismaUserRepository implements UserRepository {
    private prisma: PrismaClient
    private defaultSelect = { id: true, email: true }

    constructor() {
        this.prisma = prisma
    }

    async save(user: SignupUser): Promise<User> {
        const newUser = await this.prisma.user.create({ 
            data: user,
            select: this.defaultSelect
        }) 

        return newUser
    }

    findByEmail(email: string): Promise<User | null>
    findByEmail(email: string, showPassword: boolean): Promise<PasswordUser | null>
    async findByEmail(email: string, showPassword: boolean = false): Promise<User | PasswordUser | null> {
        let select

        if (showPassword) {
            select = {
                ...this.defaultSelect,
                password: true
            }
        } else {
            select = this.defaultSelect
        }

        const userFound = await this.prisma.user.findUnique({
            where: { email },
            select
        })

        return userFound
    }

    async findById(id: string): Promise<User | null> {

        const userFound = await this.prisma.user.findUnique({
            where: { id },
            select: this.defaultSelect
        })

        return userFound
    }

    async findByGoogleId(googleId: string): Promise<User | null> {

        const userFound = await this.prisma.user.findFirst({
            where: { google_id: googleId },
            select: this.defaultSelect
        })

        return userFound
    }

    async findByMicrosoftId(microsoftId: string): Promise<User | null> {

        const userFound = await this.prisma.user.findFirst({
            where: { microsoft_id: microsoftId },
            select: this.defaultSelect
        })

        return userFound
    }
}