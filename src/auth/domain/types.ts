export interface User {
    id: string
    email: string
    password: string
}

export type UserIn = Omit<User, "id">
export type UserOut = Omit<User, "password">