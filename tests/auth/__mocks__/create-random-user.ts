import { randomUUID } from "crypto"
import { faker } from "@faker-js/faker"

export const createRandomSignupUser = () => {
    return {
        email: faker.internet.email(),
        password: faker.internet.password({ 
            length: 9,
            pattern: /\w/
        }) + Math.floor(Math.random() * 9)
    }
}

export const createRandomGoogleUser = () => {
    return {
        email: faker.internet.email(),
        google_id: faker.number.int().toString()
    }
}

export const createRandomID = () => randomUUID()