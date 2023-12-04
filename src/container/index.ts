import { Config, loadEnv } from "@config/index"

import { AuthContainer } from "./auth.container"
import { DependencyContainer } from "./container"

class Container {
    private static instance: Container
    readonly config: Config
    readonly auth: DependencyContainer

    private constructor(config: Config) {
        this.config = config
        this.auth = new AuthContainer(this.config)
    }

    static getInstance(config?: Config): Container {
        if (!Container.instance) {
            if (!config) throw Error("Config object is missing")

            Container.instance = new Container(config)
        }

        return Container.instance
    }
}

const config = loadEnv(
    process.env.NODE_ENV === "test" ? ".env.test" : ".env")

export const container = Container.getInstance(config)