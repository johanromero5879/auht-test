import { config } from "dotenv"

export enum Env {
    DEV = "dev",
    PROD = "prod",
    TEST = "test"
}

export interface Config {
    NODE_ENV: Env
    PORT: number
    CLIENT_URL: string
    DATABASE_URL: string
    JWT_SECRET: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    GOOGLE_REDIRECT_URI: string
}

/**
 * Read an env file and get its data.
 * 
 * @returns Config. Object with environment variables loaded.
 */
export const loadEnv = (envFile: string): Config => {
    const result = config({ path: envFile })

    if (result.error) throw Error(`Error on loading ${ envFile }`)

    const configs = (result.parsed as unknown) as Config

    return configs
} 