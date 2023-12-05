import request from "supertest"

import { createApp } from "@app"
import { UserOut } from "@auth/domain"
import { loadEnv } from "@config/index"
import { container } from "@container/index"
import { type TokenService } from "@auth/application"
import { makeMockPostRequest } from "@tests/__mocks__"
import { createRandomSignupUser } from "@tests/auth/__mocks__"

const app = createApp(loadEnv(".env.test"))
const route = '/api/v1/auth'

describe(`API: ${route}`, () => {
    const user = createRandomSignupUser()
    let loggedUser: UserOut

    describe(`POST /signup`, () => {
        const endpoint = `${route}/signup`

        test("should return 201 when a user is registered", async () => {
            const { body } = await makeMockPostRequest({ 
                app, 
                endpoint, 
                body: user, 
                status: 201 // 201: Created
            })

            expect(body.success).toBeTruthy()
            expect(body.data).toHaveProperty("id")
            expect(body.data).toHaveProperty("email")

            // Save user for next tests
            loggedUser = body.data
        })

        test("should return 409 when there is a duplicated email", async () => {
            await makeMockPostRequest({ 
                app, 
                endpoint, 
                body: user, 
                status: 409 // 409: Conflict
            })
        })

        test("should return 400 when user data is not valid", async () => {
            const status = 400 // 400: Bad Request
            let body

            body = { email: "fake", password: "Fakepwd123" }
            await makeMockPostRequest({ app, endpoint, body, status})

            body = { email: "fake@example.com" }
            await makeMockPostRequest({ app, endpoint, body, status})
        })
    })

    describe(`POST /login`, () => {
        const endpoint = `${route}/login`

        test("should return 200 when a user is logged in correctly with refresh token in cookies", async () => {
            const response = await makeMockPostRequest({
                app,
                endpoint,
                body: user,
                status: 200 // 200: Ok
            })

            // Check if refresh token is in a cookie
            expect(response.header["set-cookie"]).toBeDefined()
            expect(response.header["set-cookie"][0]).toContain("refresh_token")
        })

        test("should return 401 when credentials are not valid", async () => {
            const body = {...user, email: "fake@example.com"}
            const status = 401 // 401: Unauthorized

            await makeMockPostRequest({ app, endpoint, body, status})
        })

        test("should return 400 when email or password are empty", async () => {
            let body
            const status = 400 // 400: Bad Request

            // Check password missing
            body = {email: "fake@example.com"}
            await makeMockPostRequest({ app, endpoint, body, status})

            // Check email missing
            body = {password: "d0ntLookImfake"}
            await makeMockPostRequest({ app, endpoint, body, status})
        })
    })

    describe(`DELETE /logout`, () => {
        const endpoint = `${route}/logout`
        
        test("should return 204 when user is logged out", async () => {
            await request(app)
                    .delete(endpoint)
                    .expect(204) // No content
        })
    })

    describe(`GET /refresh-token`, () => {
        const endpoint = `${route}/refresh-token`
        const tokenService = container.auth.resolve<TokenService>("TokenService")

        test("should return 201 when it creates a new access token", async () => {
            const refreshToken = tokenService.generateRefreshToken(loggedUser.id)
            await request(app)
                    .get(endpoint)
                    .set("Cookie", [`refresh_token=${refreshToken}`])
                    .expect(201) // Created
        })

        test("should return 401 when refresh token is missing", async () => {
            await request(app)
                    .get(endpoint)
                    .expect(401) // Unauthorized
        })

        test("should return 401 when refresh token is invalid", async () => {
            await request(app)
                    .get(endpoint)
                    .set("Cookie", [`refresh_token=<INVALID_REFRESH_TOKEN>`])
                    .expect(401) // Unauthorized
        })
    })
})