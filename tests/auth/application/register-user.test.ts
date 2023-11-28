import { RegisterUser } from "@auth/application"
import { DuplicateError } from "@shared/errors"
import { MockUserRepository, createRandomSignupUser } from "@tests/auth/__mocks__"

const userRepository = new MockUserRepository()
const registerUser = RegisterUser(userRepository)

describe(`auth: register user`, () => {
    const mockUser = createRandomSignupUser()

    test('should register a new user', async () => {
        await registerUser(mockUser)
    })

    test('should not allow to register a duplicated email', async () => {
        await expect(() => registerUser(mockUser))
            .rejects.toThrow(new DuplicateError("Email is already registered"))
    })
})