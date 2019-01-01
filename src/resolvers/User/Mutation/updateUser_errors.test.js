import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { userData } from "../../../testUtils/fixtures"

let mongo

describe("User Mutation resolvers", () => {
  beforeAll(async () => {
    mongo = await connectMongo()
  })
  beforeEach(async () => {
    await mongo.beforeEach()
  })
  afterEach(async () => {
    await mongo.afterEach()
  })
  afterAll(async () => {
    await mongo.afterAll()
  })

  describe("updateUser errors", () => {
    it("with no user from jwt, throws error", async () => {
      expect.assertions(1)
      await mongo.loadUsers()
      const user = null
      const modifiedUser = { email: "another@email.com" }
      const context = { mongo, user }
      try {
        await resolvers.Mutation.updateUser(null, modifiedUser, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated.")
      }
    })
    it("raises with wrong password", async () => {
      expect.assertions(2)
      await mongo.loadUsers()
      const [user] = userData
      const context = { mongo, user }
      const userInput = {
        email: "new@email.com",
        password: "wrongPass",
      }
      try {
        await resolvers.Mutation.updateUser(null, { userInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to create user.")
        expect(e.validationErrors).toEqual({ password: ["Password does not match."] })
      }
    })
    it("raises with empty username", async () => {
      expect.assertions(2)
      await mongo.loadUsers()
      const [user] = userData
      const context = { mongo, user }
      const userInput = {
        username: "",
        password: "motdepasse",
      }
      try {
        await resolvers.Mutation.updateUser(null, { userInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to create user.")
        expect(e.validationErrors).toEqual({ username: ["Username is empty."] })
      }
    })
    it("raises with username taken", async () => {
      expect.assertions(2)
      await mongo.loadUsers()
      const [user] = userData
      const context = { mongo, user }
      const userInput = {
        username: "user2",
        password: "motdepasse",
      }
      try {
        await resolvers.Mutation.updateUser(null, { userInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to create user.")
        expect(e.validationErrors).toEqual({ username: ["Username is already taken."] })
      }
    })
    it("raises with empty email", async () => {
      expect.assertions(2)
      await mongo.loadUsers()
      const [user] = userData
      const context = { mongo, user }
      const userInput = {
        email: "",
        password: "motdepasse",
      }
      try {
        await resolvers.Mutation.updateUser(null, { userInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to create user.")
        expect(e.validationErrors).toEqual({ email: ["Email is empty."] })
      }
    })
    it("raises with wrong email", async () => {
      expect.assertions(2)
      await mongo.loadUsers()
      const [user] = userData
      const context = { mongo, user }
      const userInput = {
        email: "notAnEmail",
        password: "motdepasse",
      }
      try {
        await resolvers.Mutation.updateUser(null, { userInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to create user.")
        expect(e.validationErrors).toEqual({ email: ["Email is not valid."] })
      }
    })
    it("raises with empty newPassword", async () => {
      expect.assertions(2)
      await mongo.loadUsers()
      const [user] = userData
      const context = { mongo, user }
      const userInput = {
        password: "motdepasse",
        newPassword: "",
      }
      try {
        await resolvers.Mutation.updateUser(null, { userInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to create user.")
        expect(e.validationErrors).toEqual({ newPassword: ["New Password is empty."] })
      }
    })
    it("raises with invalid newPassword", async () => {
      expect.assertions(2)
      await mongo.loadUsers()
      const [user] = userData
      const context = { mongo, user }
      const userInput = {
        password: "motdepasse",
        newPassword: "12345",
      }
      try {
        await resolvers.Mutation.updateUser(null, { userInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to create user.")
        expect(e.validationErrors).toEqual({
          newPassword: ["Password must have length between 6 and 48 chars."],
        })
      }
    })
  })
})
