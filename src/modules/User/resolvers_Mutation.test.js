import { ObjectId } from "mongodb"
import resolvers from "./resolvers"
import connectMongo from "../../testUtils/mongoTest"
import { userData, dateUtils } from "../../testUtils/fixtures"

let mongo

describe("User Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("createUser", () => {
    it("with newcomerId and password, persists the user", async () => {
      await mongo.loadNewcomers()
      const context = { mongo }
      const newUser = {
        authProvider: {
          newcomer: {
            id: "5a4b76d5fdea180e9295743c",
            password: "Mot2pa$$e.De.Ouf",
          },
        },
      }
      const response = await resolvers.Mutation.createUser(null, newUser, context)
      expect(response.email).toEqual("user1@example.com")
      expect(response.version).toEqual(1)
      expect(response.jwt).toMatch(/ey.+\.ey.+\..+/)
    })
    it("raises error if no newcomer", async () => {
      expect.assertions(1)
      const context = { mongo }
      const newUser = {
        authProvider: {
          newcomer: {
            id: "5a4b76d5fdea180e9295743c",
            password: "Mot2pa$$e.De.Ouf",
          },
        },
      }
      try {
        await resolvers.Mutation.createUser(null, newUser, context)
      } catch (e) {
        expect(e.message).toEqual("No newcomer with that id.")
      }
    })
    it("raises error if user already exists", async () => {
      expect.assertions(1)
      await mongo.loadNewcomers()
      await mongo.loadUsers()
      const context = { mongo }
      const newUser = {
        authProvider: {
          newcomer: {
            id: "5a4b76d5fdea180e9295743c",
            password: "Mot2pa$$e.De.Ouf",
          },
        },
      }
      try {
        await resolvers.Mutation.createUser(null, newUser, context)
      } catch (e) {
        expect(e.message).toEqual("An account was already created with this email.")
      }
    })
    it("raises an error if password too weak", async () => {
      await mongo.loadNewcomers()
      const context = { mongo }
      const newUser = {
        authProvider: {
          newcomer: {
            id: "5a4b76d5fdea180e9295743c",
            password: "password",
          },
        },
      }
      try {
        await resolvers.Mutation.createUser(null, newUser, context)
      } catch (e) {
        expect(e.message).toEqual("Password too weak.")
      }
    })
  })

  describe("signinUser", () => {
    it("if user exists, it returns the user", async () => {
      await mongo.loadUsers()
      const context = { mongo }
      const credentials = {
        emailAuth: {
          email: "user1@example.com",
          password: "motdepasse",
        },
      }
      const response = await resolvers.Mutation.signinUser(null, credentials, context)
      expect(response._id).toMatchObject(ObjectId("5a31b456c5e7b54a9aba3782"))
      expect(response.jwt).toMatch(/ey.+\.ey.+\..+/)
      expect(response.email).toEqual("user1@example.com")
      expect(response.version).toEqual(1)
    })

    it("with no user, throws error", async () => {
      const context = { mongo }
      const credentials = {
        emailAuth: {
          email: "user1@example.com",
          password: "motdepasse",
        },
      }
      try {
        await resolvers.Mutation.signinUser(null, credentials, context)
      } catch (e) {
        expect(e.message).toEqual("User does not exist")
      }
    })

    it("with wrong password, throws error", async () => {
      await mongo.loadUsers()
      const context = { mongo }
      const credentials = {
        emailAuth: {
          email: "user1@example.com",
          password: "wrongPassword",
        },
      }
      try {
        await resolvers.Mutation.signinUser(null, credentials, context)
      } catch (e) {
        expect(e.message).toEqual("Email or password provided don't match")
      }
    })
  })

  describe("updateUser", () => {
    it("with correct jwt, it updates user", async () => {
      await mongo.loadUsers()
      const [user] = userData
      const modifiedUser = { email: "another@email.com" }
      const context = { mongo, user }
      const response = await resolvers.Mutation.updateUser(null, modifiedUser, context)
      expect(response).toMatchObject({
        ...user,
        email: "another@email.com",
        version: 2,
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
        expect(e.message).toMatch("Unauthenticated.")
      }
    })
  })
})
