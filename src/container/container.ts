import { Config } from "@config/index"

export class DependencyContainer {
    private dependencies: Record<string, any> = {}
    protected config: Config

    constructor(config: Config) {
        this.config = config
    }

    register(name: string, dependency: any): void {
        this.dependencies[name] = dependency
    }

    resolve<T>(name: string): T {
        if (!this.dependencies[name]) {
            throw new Error(`Dependency ${name} not registered`)
        }

        return this.dependencies[name]
    }

}