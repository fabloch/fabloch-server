import { ObjectId } from "mongodb"
import resolvers from "./resolvers"
import connectMongo from "../../testUtils/mongoTest"
import { userData, membershipData } from "../../testUtils/fixtures"

let mongo

describe("User resolver", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => mongo.beforeEach())
  afterEach(async () => mongo.afterEach())
  afterAll(async () => mongo.afterAll())

  describe("Query", () => {
    describe("user", () => {
      it("returns user from context", async () => {
        await mongo.loadUsers()
        const user = await mongo.Users.findOne({ email: "user1@example.com" })
        const context = { user }
        return resolvers.Query.user(null, null, context).then((results) => {
          expect(results).toEqual({
            _id: ObjectId("5a31b456c5e7b54a9aba3782"),
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
