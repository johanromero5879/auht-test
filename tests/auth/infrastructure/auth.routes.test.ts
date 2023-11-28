import request from "supertest"

import { createRandomSignupUser, MockUserRepository } from "@tests/auth/__mocks__"
import { app } from "@app"

jest.mock("@auth/infrastructure/repositories", () => ({
    PrismaUserRepository: jest.fn().mockImplementation(() => new MockUserRepository())
}))

const route = '/api/v1/auth'

describe(`API: ${route}`, () => {
    describe(`POST ${route}/signup`, () => {
        const endpoint = `${route}/signup`
        const user = createRandomSignupUser()

        const testRequest = async (body: any, status: number) => {
            return await request(app)
                            .post(endpoint)
                            .send(body)
                            .expect("Content-Type", /json/)
                            .expect(status)
        }

        test("should return 201 when a user is registered", async () => {
            await testRequest(user, 201) // 201: Created
        })

        test("should return 409 when there is a duplicated email", async () => {
            await testRequest(user, 409) // 409: Conflict
        })

        test("should return 400 when user data is not valid", async () => {
            // 400: Bad Request
            await testRequest({ email: "fake", password: "Fakepwd123" }, 400)
            await testRequest({ email: "fake@example.com" }, 400)
        })
    })
})