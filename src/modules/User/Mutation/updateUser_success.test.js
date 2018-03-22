import bcrypt from "bcrypt"
import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { userData } from "../../../testUtils/fixtures"

let mongo

describe("User Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("updateUser success", () => {
    it("updates the email, increments version and return a new jwt", async () => {
      await mongo.loadUsers()
      const [user] = userData
      const context = { mongo, user }
      const userInput = {
        email: "another@email.com",
        password: "motdepasse",
      }
      const response = await resolvers.Mutation.updateUser(null, { userInput }, context)
      expect(response).toMatchObject({
        ...user,
        email: "another@email.com",
        version: 2,
      })
    })
    it("updates the newPassword, increments version and return a new jwt", async () => {
      await mongo.loadUsers()
      const [user] = userData
      const context = { mongo, user }
      const userInput = {
        password: "motdepasse",
        newPassword: "Thi$Is!UnN0uveauMot2Passe!",
      }
      const response = await resolvers.Mutation.updateUser(null, { userInput }, context)
      const newPasswordValid = await bcrypt.compare(userInput.newPassword, response.password)
      expect(newPasswordValid).toBeTruthy()
      expect(response.version).toEqual(2)
    })
    it("updates the username with same username", async () => {
      await mongo.loadUsers()
      const [user] = userData
      const context = { mongo, user }
      const userInput = { username: "user1", password: "motdepasse" }
      const response = await resolvers.Mutation.updateUser(null, { userInput }, context)
      expect(response).toMatchObject({
        username: "user1",
        version: 2,
      })
    })
    it("updates the username with a different one", async () => {
      await mongo.loadUsers()
      const [user] = userData
      const context = { mongo, user }
      const userInput = { username: "patoche", password: "motdepasse" }
      const response = await resolvers.Mutation.updateUser(null, { userInput }, context)
      expect(response).toMatchObject({
        username: "patoche",
        version: 2,
      })
    })
  })
})
