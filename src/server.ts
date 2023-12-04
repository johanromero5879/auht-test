import { createApp } from "./app"
import { loadEnv } from "./config"

/**
 * Execute the application
 */
const run = async () => {
    try {
        // Load environment variables
        const config = loadEnv(".env")
        const app = createApp(config)
        
        // Deploy the application
        app.listen(config.PORT)  
        
        console.log(`Environment ${config.NODE_ENV}`)
        console.log(`Server on port ${config.PORT}`)
    } catch (err) {
        console.error(err)
    }
}

run()