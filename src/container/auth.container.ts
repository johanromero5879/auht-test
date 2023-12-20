import { Config, Env } from "@config/index"
import { UserRepository } from "@auth/domain"
import { DependencyContainer } from "./container"
import { PrismaUserRepository, InMemoryUserRepository } from "@auth/infrastructure/repositories"
import { 
    RegisterUser, 
    TokenService, 
    FindUserById,
    GoogleService, 
    VerifyCredentials, 
    RegisterGoogleUser,
    FindUserByGoogleId, 
} from "@auth/application"
import { 
    LoginController, 
    LogoutController, 
    SignupController, 
    RefreshTokenController, 
    GoogleOAuthController,
    RedirectGoogleOAuthController,
} from "@auth/infrastructure/controller"

export class AuthContainer extends DependencyContainer {
    constructor(config: Config) {
        super(config)
        this.build()
    }

    private build() {
        const userRepository = this.getUserRepository()
        const registerUser = RegisterUser(userRepository)
        const registerGoogleUser = RegisterGoogleUser(userRepository)
        const verifyCredentials = VerifyCredentials(userRepository)
        const findUserById = FindUserById(userRepository)
        const findUserByGoogleId = FindUserByGoogleId(userRepository)
        const tokenService = new TokenService(this.config.JWT_SECRET)
        const googleService = new GoogleService({
            clientId: this.config.GOOGLE_CLIENT_ID,
            clientSecret: this.config.GOOGLE_CLIENT_SECRET,
            redirectUri: this.config.GOOGLE_REDIRECT_URI
        })

        // domain
        this.register("UserRepository", userRepository)

        // application
        this.register("RegisterUser", registerUser)
        this.register("RegisterGoogleUser", registerGoogleUser)
        this.register("VerifyCredentials", verifyCredentials)
        this.register("TokenService", tokenService)
        this.register("GoogleService", googleService)

        // infrastructure
        this.register("SignupController", SignupController(registerUser, tokenService))
        this.register("LoginController", LoginController(verifyCredentials, tokenService))
        this.register("LogoutController", LogoutController())
        this.register("RefreshTokenController", RefreshTokenController(findUserById, tokenService))
        this.register("RedirectGoogleOAuthController", RedirectGoogleOAuthController(googleService))
        this.register("GoogleOAuthController", GoogleOAuthController({ 
            googleService, 
            findUserByGoogleId, 
            registerGoogleUser, 
            tokenService,
            clientUrl: this.config.CLIENT_URL
        }))
    }

    private getUserRepository(): UserRepository {
        if (this.config.NODE_ENV !== Env.TEST) {
            return new PrismaUserRepository()
        }

        return new InMemoryUserRepository()
    }
}