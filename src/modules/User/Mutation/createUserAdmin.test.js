import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, userData } from "../../../testUtils/fixtures"

let mongo

describe("User Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("createUserAdmin", () => {
    describe("valid", () => {
      it("creates the user with email, password, fullName", async () => {
        const user = admin
        const context = { mongo, user }
        const userInput = {
          email: "speaker@example.com",
          username: "speaker",
          password: "Mot2pa$$e.De.Ouf",
          profile: {
            fullName: "Speaker Example",
          },
        }
        const response = await resolvers.Mutation.createUserAdmin(null, { userInput }, context)
        expect(response.username).toEqual("speaker")
        expect(response.email).toEqual("speaker@example.com")
        expect(response.profile.fullName).toEqual("Speaker Example")
        expect(response.version).toEqual(1)
        expect(response.jwt).toMatch(/ey.+\.ey.+\..+/)
      })
    })
    describe("invalid", () => {
      it("raises if not authenticated", async () => {
        expect.assertions(2)
        const user = null
        const context = { mongo, user }
        const userInput = {
          email: "speaker@example.com",
          username: "speaker",
          password: "Mot2pa$$e.De.Ouf",
          profile: {
            fullName: "Speaker Example",
          },
        }
        try {
          await resolvers.Mutation.createUserAdmin(null, { userInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ main: ["Unauthenticated."] })
        }
      })
      it("raises if not admin", async () => {
        expect.assertions(2)
        const user = userData[0]
        const context = { mongo, user }
        const userInput = {
          email: "speaker@example.com",
          username: "speaker",
          password: "Mot2pa$$e.De.Ouf",
          profile: {
            fullName: "Speaker Example",
          },
        }
        try {
          await resolvers.Mutation.createUserAdmin(null, { userInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ main: ["Not allowed."] })
        }
      })
      it("raises error if email taken", async () => {
        expect.assertions(2)
        await mongo.loadUsers()
        const user = admin
        const context = { mongo, user }
        const userInput = {
          email: "user1@example.com",
          username: "speaker",
          password: "Mot2pa$$e.De.Ouf",
          profile: {
            fullName: "Speaker Example",
          },
        }
        try {
          await resolvers.Mutation.createUserAdmin(null, { userInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ email: ["An account was already created with this email."] })
        }
      })
      it("raises error if username taken", async () => {
        expect.assertions(2)
        await mongo.loadUsers()
        const user = admin
        const context = { mongo, user }
        const userInput = {
          email: "speaker@example.com",
          username: "user1",
          password: "Mot2pa$$e.De.Ouf",
          profile: {
            fullName: "Speaker Example",
          },
        }
        try {
          await resolvers.Mutation.createUserAdmin(null, { userInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ username: ["This username is not available."] })
        }
      })
      it("raises error if username not in lowercase", async () => {
        expect.assertions(2)
        const user = admin
        const context = { mongo, user }
        const userInput = {
          email: "speaker@example.com",
          username: "Speaker",
          password: "Mot2pa$$e.De.Ouf",
          profile: {
            fullName: "Speaker Example",
          },
        }
        try {
          await resolvers.Mutation.createUserAdmin(null, { userInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ username: ["Username should only container lowercase letters, numbers, dashes or underscores."] })
        }
      })
      it("raises error if username has a space", async () => {
        expect.assertions(2)
        const user = admin
        const context = { mongo, user }
        const userInput = {
          email: "speaker@example.com",
          username: "speaker withspace",
          password: "Mot2pa$$e.De.Ouf",
          profile: {
            fullName: "Speaker Example",
          },
        }
        try {
          await resolvers.Mutation.createUserAdmin(null, { userInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ username: ["Username should only container lowercase letters, numbers, dashes or underscores."] })
        }
      })
      it("raises error if username has special char", async () => {
        expect.assertions(2)
        const user = admin
        const context = { mongo, user }
        const userInput = {
          email: "speaker@example.com",
          username: "$peaker",
          password: "Mot2pa$$e.De.Ouf",
          profile: {
            fullName: "Speaker Example",
          },
        }
        try {
          await resolvers.Mutation.createUserAdmin(null, { userInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ username: ["Username should only container lowercase letters, numbers, dashes or underscores."] })
        }
      })
      it("raises an error if password too weak", async () => {
        expect.assertions(2)
        const user = admin
        const context = { mongo, user }
        const userInput = {
          email: "speaker@example.com",
          username: "speaker",
          password: "password",
          profile: {
            fullName: "Speaker Example",
          },
        }
        try {
          await resolvers.Mutation.createUserAdmin(null, { userInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ password: ["Password is too weak."] })
        }
      })
    })
  })
})
