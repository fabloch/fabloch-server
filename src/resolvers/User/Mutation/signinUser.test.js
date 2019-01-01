import { ObjectId } from "mongodb"
import jwt from "jsonwebtoken"
import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"

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

  describe("signinUser", () => {
    it("if user exists, it returns the user", async () => {
      await mongo.loadUsers()
      const context = { mongo }
      const emailAuth = {
        email: "user1@example.com",
        password: "motdepasse",
      }
      const response = await resolvers.Mutation.signinUser(null, { emailAuth }, context)
      expect(response._id).toMatchObject(ObjectId("5a31b456c5e7b54a9aba3782"))
      expect(response.jwt).toMatch(/ey.+\.ey.+\..+/)
      expect(response.email).toEqual("user1@example.com")
      expect(response.version).toEqual(1)
    })

    it("returns roles in jwt if user has roles", async () => {
      await mongo.loadAdmin()
      const context = { mongo }
      const emailAuth = {
        email: "admin@example.com",
        password: "motdepasse",
      }
      const response = await resolvers.Mutation.signinUser(null, { emailAuth }, context)
      expect(jwt.decode(response.jwt)).toMatchObject({
        roles: ["admin"],
      })
    })

    it("with no user, throws error", async () => {
      expect.assertions(1)
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
        expect(e.message).toEqual("User does not exist.")
      }
    })

    it("with wrong password, throws error", async () => {
      expect.assertions(1)
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
        expect(e.message).toEqual("Email or password provided don't match.")
      }
    })
  })
})
