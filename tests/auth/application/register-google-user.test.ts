import { container } from "@container/index"
import { DuplicateError } from "@shared/errors"
import { IRegisterGoogleUser } from "@auth/application"
import { createRandomGoogleUser } from "@tests/auth/__mocks__"

const registerUser = container.auth.resolve<IRegisterGoogleUser>("RegisterGoogleUser")

describe(`auth: register user`, () => {
    const mockUser = createRandomGoogleUser()

    test('should register a new user from google', async () => {
        const registeredUser = await registerUser(mockUser)
        expect(registeredUser).toHaveProperty("id")
        expect(registeredUser).toHaveProperty("email")
    })

    test('should not allow to register a duplicated email', async () => {
        await expect(() => registerUser(mockUser))
            .rejects.toThrow(new DuplicateError("Email is already registered"))
    })
})