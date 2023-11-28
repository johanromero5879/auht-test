import { Router } from "express"

import { RegisterUser } from "../application";
import { SignupController } from "./controller";
import { PrismaUserRepository } from "./repositories";

// Dependencies
const userRepository = new PrismaUserRepository()
const registerUser = RegisterUser(userRepository)

// Router
export const authRouter = Router()

authRouter.post("/signup", SignupController(registerUser))
