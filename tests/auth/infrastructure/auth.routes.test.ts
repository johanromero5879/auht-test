import { createApp } from "@app"
import { loadEnv } from "@config/index"
import { makeMockPostRequest } from "@tests/__mocks__"
import { createRandomSignupUser } from "@tests/auth/__mocks__"

const app = createApp(loadEnv(".env.test"))
const route = '/api/v1/auth'

describe(`API: ${route}`, () => {
    const user = createRandomSignupUser()

    describe(`POST ${route}/signup`, () => {
        const endpoint = `${route}/signup`


        test("should return 201 when a user is registered", async () => {
            await makeMockPostRequest({ 
                app, 
                endpoint, 
                body: user, 
                status: 201 // 201: Created
            })
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

    describe(`POST ${route}/login`, () => {
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
})