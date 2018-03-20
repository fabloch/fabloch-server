import bcrypt from "bcrypt"
import resolvers from "../../resolvers"
import connectMongo from "../../../../testUtils/mongoTest"
import { userData } from "../../../../testUtils/fixtures"

let mongo

describe("User Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("updateUser", () => {
    describe("with correct jwt", () => {
      it("updates the email, increments version and return a new jwt", async () => {
        await mongo.loadUsers()
        const [user] = userData
        const context = { mongo, user }
        const userInput = { email: "another@email.com" }
        const response = await resolvers.Mutation.updateUser(null, { userInput }, context)
        expect(response).toMatchObject({
          ...user,
          email: "another@email.com",
          version: 2,
        })
      })
      it("updates the password, increments version and return a new jwt", async () => {
        await mongo.loadUsers()
        const [user] = userData
        const context = { mongo, user }
        const password = "Thi$Is!UnN0uveauMot2Passe!"
        const userInput = { password }
        const response = await resolvers.Mutation.updateUser(null, { userInput }, context)
        const passwordValid = await bcrypt.compare(password, response.password)
        expect(passwordValid).toBeTruthy()
        expect(response.version).toEqual(2)
      })
      it("updates the username", async () => {
        await mongo.loadUsers()
        const [user] = userData
        const context = { mongo, user }
        const userInput = { username: "patoche" }
        const response = await resolvers.Mutation.updateUser(null, { userInput }, context)
        expect(response).toMatchObject({
          username: "patoche",
          version: 2,
        })
      })
      it("updates the profile picUrl", async () => {
        await mongo.loadUsers()
        const [user] = userData
        const context = { mongo, user }
        const profile = {
          picUrl: "http://www.google.com/image.jpg",
        }
        const userInput = { profile }
        const response = await resolvers.Mutation.updateUser(null, { userInput }, context)
        expect(response).toMatchObject({
          profile,
          version: 1,
        })
      })
      it("updates the profile intro", async () => {
        await mongo.loadUsers()
        const [user] = userData
        const context = { mongo, user }
        const profile = {
          intro: "Tantum autem cuique tribuendum, \nprimum quantum ipse\nefficere possis.",
        }
        const userInput = { profile }
        const response = await resolvers.Mutation.updateUser(null, { userInput }, context)
        expect(response).toMatchObject({
          profile,
          version: 1,
        })
      })
    })

    it("with no user from jwt, throws error", async () => {
      await mongo.loadUsers()
      const user = null
      const modifiedUser = { email: "another@email.com" }
      const context = { mongo, user }
      try {
        await resolvers.Mutation.updateUser(null, modifiedUser, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Unauthenticated."] })
      }
    })
  })
})
