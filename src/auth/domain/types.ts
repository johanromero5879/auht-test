export interface User {
    id: string
    email: string
}

export interface PasswordUser extends User {
    password: string
}
export type PasswordUserIn = Omit<PasswordUser, "id">

export interface GoogleUser extends User {
    google_id: string
}
export type GoogleUserIn = Omit<GoogleUser, "id">

export interface OutlookUser extends User {
    outlook_id: string
}
export type OutlookUserIn = Omit<OutlookUser, "id">

export type SignupUser = PasswordUserIn | GoogleUserIn | OutlookUserIn
export type UserWithCredentials = PasswordUser | GoogleUser | OutlookUser

