import { Config, Env } from "@config/index"
import { UserRepository } from "@auth/domain"
import { DependencyContainer } from "./container"
import { RegisterUser, TokenService, VerifyCredentials } from "@auth/application"
import { PrismaUserRepository, InMemoryUserRepository } from "@auth/infrastructure/repositories"
import { LoginController, SignupController } from "@auth/infrastructure/controller"

export class AuthContainer extends DependencyContainer {
    constructor(config: Config) {
        super(config)
        this.build()
    }

    private build() {
        const userRepository = this.getUserRepository()
        const registerUser = RegisterUser(userRepository)
        const verifyCredentials = VerifyCredentials(userRepository)
        const tokenService = new TokenService(this.config.JWT_SECRET)

        // domain
        this.register("UserRepository", userRepository)

        // application
        this.register("RegisterUser", registerUser)
        this.register("VerifyCredentials", verifyCredentials)

        // infrastructure
        this.register("SignupController", SignupController(registerUser))
        this.register("LoginController", LoginController(verifyCredentials, tokenService))
    }

    private getUserRepository(): UserRepository {
        if (this.config.NODE_ENV !== Env.TEST) {
            return new PrismaUserRepository()
        }

        return new InMemoryUserRepository()
    }
}