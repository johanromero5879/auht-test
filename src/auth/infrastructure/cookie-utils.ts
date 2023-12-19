import { Response } from "express"

export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
    res.cookie("refresh_token", refreshToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "prod", // Set to true in a production environment (requires HTTPS), 
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in miliseconds , 
        sameSite: process.env.NODE_ENV === "prod" ? "strict": "none"
    })
}

export const clearRefreshTokenCookie = (res: Response) => {
    res.clearCookie("refresh_token")
}