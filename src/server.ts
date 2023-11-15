import { loadEnv } from "./config"
import { app } from "./app"

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
    } catch (error) {
        console.error(error)
    }
    
}

run()
