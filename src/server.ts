import { app } from "./app"
import { loadEnv } from "./config"

/**
 * Execute the application
 */
const run = async () => {
    try {
        // Load environment variables
        const config = loadEnv(".env")
        
        // Deploy the application
        app.listen(config.PORT)        
        console.log(`Server on port ${config.PORT}`)
    } catch (err) {
        console.error(err)
    }
}

run()