import express, { json, Router } from "express"

import { authRouter } from "@auth/infrastructure/auth.routes"
import { errorHandlerMiddleware } from "@shared/infrastructure/response-handler"

export const app = express()

// Middlewares
app.use(json())

// Routes
const router = Router()
router.use("/auth", authRouter)
app.use("/api/v1", router)

app.get("/", (req, res) => {
    res.send("Auth testing")
})

// Error handler
app.use(errorHandlerMiddleware)
