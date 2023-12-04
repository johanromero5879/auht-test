import cors from "cors"
import cookieParser from "cookie-parser"
import express, { json, Router } from "express"

import { Config } from "@config/index"
import { authRouter } from "@auth/infrastructure/auth.routes"
import { errorHandlerMiddleware } from "@shared/infrastructure/response-handler"

export const createApp = (config: Config) => {
    const app = express()

    // Middlewares
    app.use(json())
    app.use(cookieParser())
    app.use(cors({
        origin: config.ALLOWED_ORIGINS.split(","),
        credentials: true
    }))

    // Routes
    const router = Router()
    router.use("/auth", authRouter)
    app.use("/api/v1", router)

    app.get("/", (req, res) => {
        res.send("Auth testing")
    })

    // Error handler
    app.use(errorHandlerMiddleware)

    return app
}