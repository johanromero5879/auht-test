import { Router } from "express"

import { container } from "@container/index";
import { Controller } from "@shared/infrastructure/controller";

// Router
export const authRouter = Router()

authRouter.post("/signup", container.auth.resolve<Controller>("SignupController"))
authRouter.post("/login", container.auth.resolve<Controller>("LoginController"))
authRouter.delete("/logout", container.auth.resolve<Controller>("LogoutController"))
authRouter.get("/refresh-token", container.auth.resolve<Controller>("RefreshTokenController"))
