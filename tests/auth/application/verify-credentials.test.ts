import { PasswordUserIn } from "@auth/domain"
import { container } from "@container/index"
import { createRandomSignupUser } from "@tests/auth/__mocks__"
import { IRegisterUser, IVerifyCredentials } from "@auth/application"
import { AuthenticationError, ValidationError } from "@shared/errors"

const registerUser = container.auth.resolve<IRegisterUser>("RegisterUser")
const verifyCredentials = container.auth.resolve<IVerifyCredentials>("VerifyCredentials")

let user: PasswordUserIn

beforeAll(async () => {
    user = createRandomSignupUser()
    await registerUser(user)
})

describe("auth: verify credentials", () => {

    test("should return user data when credentials are valid", async () => {
        const { email, password } = user
        const userFound = await verifyCredentials(email, password)

        expect(userFound).toHaveProperty("id")
        expect(userFound).toHaveProperty("email")
        expect(userFound).not.toHaveProperty("password")
    })

    test("should throw an error when credentials are invalid", async () => {
        const authError = new AuthenticationError("You have entered an invalid email or password")
        let email, password

        // Check a valid email with wrong password
        email = user.email
        password = "F4ke_Pwd"

        await expect(verifyCredentials(email, password))
                .rejects.toThrow(authError)

        // Check a non-registered email with a password from a registered user
        email = "john.titor@example.com"
        password = user.password

        await expect(verifyCredentials(email, password))
                .rejects.toThrow(authError)
    })

    test("should throw an error when email or password are empty", async () => {
        let email, password

        // Check empty email
        email = ""
        password = user.password

        await expect(verifyCredentials(email, password))
                .rejects.toThrow(new ValidationError("Email is required"))

        // Check empty password
        email = user.email
        password = ""

        await expect(verifyCredentials(email, password))
                .rejects.toThrow(new ValidationError("Password is required"))
    })
})