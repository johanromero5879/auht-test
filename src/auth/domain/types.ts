export interface User {
    id: string
    email: string
}

export interface PasswordUser extends User {
    password: string
}
export type PasswordUserIn = Omit<PasswordUser, "id">

export interface GoogleUser extends Omit<User, "id"> {
    google_id: string
}

export interface MicrosoftUser extends Omit<User, "id"> {
    microsoft_id: string
}

export type SignupUser = PasswordUserIn | GoogleUser | MicrosoftUser

