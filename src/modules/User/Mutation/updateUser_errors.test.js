import resolvers from "../resolvers"
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
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ password: ["Password does not match."] })
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
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ username: ["Can't be empty."] })
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
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ username: ["Username taken."] })
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
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ email: ["Can't be empty."] })
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
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ email: ["Invalid email."] })
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
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ newPassword: ["Can't be empty."] })
      }
    })
    it("raises with invalid newPassword", async () => {
      expect.assertions(2)
      await mongo.loadUsers()
      const [user] = userData
      const context = { mongo, user }
      const userInput = {
        password: "password",
        newPassword: "12345",
      }
      try {
        await resolvers.Mutation.updateUser(null, { userInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ newPassword: ["Password too weak."] })
      }
    })
  })
})
