import { config } from "dotenv"

export enum Env {
    DEV = "dev",
    PROD = "prod",
    TEST = "test"
}

interface Config {
    NODE_ENV: Env,
    PORT: number,
    DATABASE_URL: string
}

/**
 * Read an env file and get its data.
 * 
 * @returns Config. Object with environment variables loaded.
 */
export const loadEnv = (envFile: string): Config => {
    const result = config({ path: envFile })

    if (result.error) throw Error(`Error on loading ${ envFile }`)
    console.log(`Loaded ${envFile}`)

    const configs = (result.parsed as unknown) as Config

    console.log(`Environment ${configs.NODE_ENV}`)
    return configs
} 