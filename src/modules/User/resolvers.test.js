import { ObjectId } from "mongodb"
import resolvers from "./resolvers"
import connectMongo from "../../testUtils/mongoTest"
import { userData, membershipData } from "../../testUtils/fixtures"

let mongo

describe("User resolver", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(() => mongo.afterEach())
  afterAll(() => { mongo.tearDown() })

  describe("Query", () => {
    describe("user", () => {
      it("returns user from context", async () => {
        await mongo.loadUsers()
        const user = await mongo.Users.findOne({ email: "user1@example.com" })
        const context = { user }
        return resolvers.Query.user(null, null, context).then((results) => {
          expect(results).toEqual({
            _id: ObjectId("5a31b456c5e7b54a9aba3782"),
            name: "User One",
            email: "user1@example.com",
            password: "$2a$10$Htm2b52NAP2XE5pD8LnK2OP58PTf9kXxaEtKxMmbI28Udappwayy6",
            version: 1,
          })
        })
      })

      it("returns null if no user", async () => {
        const user = null
        const context = { user }
        return resolvers.Query.user(null, null, context).then((results) => {
          expect(results).toEqual(null)
        })
      })
    })
  })

  describe("Mutation", () => {
    describe("createUser", () => {
      it("if no previous user, persists the user", async () => {
        const context = { mongo }
        const newUser = {
          name: "New User",
          authProvider: {
            email: {
              email: "user@example.com",
              password: "$2a$10$4gx3tkvkV5uosBHRyjAOVe7y3Za8BPuicCwWIDFAk.hju4IuLip.e",
            },
          },
        }
        const response = await resolvers.Mutation.createUser(null, newUser, context)
        expect(response).toMatchObject({
          email: "user@example.com",
          name: "New User",
          version: 1,
        })
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
        expect(response).toMatchObject({
          _id: ObjectId("5a31b456c5e7b54a9aba3782"),
          email: "user1@example.com",
          name: "User One",
          version: 1,
        })
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
        const modifiedUser = { name: "New Name" }
        const context = { mongo, user }
        const response = await resolvers.Mutation.updateUser(null, modifiedUser, context)
        expect(response).toMatchObject({
          ...user,
          name: "New Name",
          version: 2,
        })
      })

      it("with no user from jwt, throws error", async () => {
        await mongo.loadUsers()
        const user = null
        const modifiedUser = { name: "New Name" }
        const context = { mongo, user }
        try {
          await resolvers.Mutation.updateUser(null, modifiedUser, context)
        } catch (e) {
          expect(e.message).toMatch("Unauthenticated.")
        }
      })
    })
  })

  describe("User", () => {
    it("returns id from _id", () => {
      const user = {
        _id: ObjectId("5a343c2d9d29ab155b930b3f"),
        body: "Lorem Ipsum",
      }
      expect(resolvers.User.id(user)).toEqual("5a343c2d9d29ab155b930b3f")
    })

    it("returns user's memberships", async () => {
      await mongo.loadUsers()
      await mongo.loadMemberships()
      const [user] = userData
      const context = { mongo, user }
      const response = await resolvers.User.memberships(user, null, context)
      expect(response).toEqual(membershipData)
    })
  })
})
