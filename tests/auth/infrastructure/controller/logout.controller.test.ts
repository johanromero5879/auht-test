import { container } from "@container/index"
import { createMockReqAndRes } from "@tests/__mocks__"
import { Controller } from "@shared/infrastructure/controller"

const logoutController = container.auth.resolve<Controller>("LogoutController")

describe("auth: logout controller", () => {
    test("should call clearCookie to remove refresh_token cookie", async () => {
        const { req, res, next } = createMockReqAndRes()
        // Mock a cookie
        req.cookies = { refresh_token: "<MOCKED_TOKEN>" }

        await logoutController(req, res, next)

        expect(res.clearCookie).toHaveBeenCalledWith("refresh_token")
    })
})