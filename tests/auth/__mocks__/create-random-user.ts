import { faker } from "@faker-js/faker"

import { UserIn } from "@auth/domain"

export const createRandomSignupUser = (): UserIn => {
    return {
        email: faker.internet.email(),
        password: faker.internet.password({ 
            length: 9,
            pattern: /\w/
        }) + Math.floor(Math.random() * 9)
    }
}