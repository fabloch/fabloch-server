import { ObjectId } from "mongodb"
import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"

let mongo

describe("User Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

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
      expect.assertions(2)
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
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({
          main: ["User does not exist."],
        })
      }
    })

    it("with wrong password, throws error", async () => {
      expect.assertions(2)
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
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({
          main: ["Email or password provided don't match."],
        })
      }
    })
  })
})
