import { container } from "@container/index"
import { DuplicateError } from "@shared/errors"
import { IRegisterUser } from "@auth/application"
import { createRandomSignupUser } from "@tests/auth/__mocks__"

const registerUser = container.auth.resolve<IRegisterUser>("RegisterUser")

describe(`auth: register user`, () => {
    const mockUser = createRandomSignupUser()

    test('should register a new user', async () => {
        const registeredUser = await registerUser(mockUser)
        expect(registeredUser).toHaveProperty("id")
        expect(registeredUser).toHaveProperty("email")
    })

    test('should not allow to register a duplicated email', async () => {
        await expect(() => registerUser(mockUser))
            .rejects.toThrow(new DuplicateError("Email is already registered"))
    })
})