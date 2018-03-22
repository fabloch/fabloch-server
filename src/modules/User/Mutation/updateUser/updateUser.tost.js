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
      it("updates the username", async () => {
        await mongo.loadUsers()
        const [user] = userData
        const context = { mongo, user }
        const userInput = { username: "patoche", password: "motdepasse" }
        const response = await resolvers.Mutation.updateUser(null, { userInput }, context)
        expect(response).toMatchObject({
          username: "patoche",
          password: "motdepasse",
          version: 2,
        })
      })
      it("updates the profile fullName", async () => {
        await mongo.loadUsers()
        const [user] = userData
        const context = { mongo, user }
        const profile = {
          fullName: "John Doe",
        }
        const userInput = { profile }
        const response = await resolvers.Mutation.updateUser(null, { userInput }, context)
        expect(response).toMatchObject({
          profile,
          version: 1,
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
    describe("errors", () => {
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
      it("password is false", async () => {
        expect.assertions(2)
        await mongo.loadUsers()
        const [user] = userData
        const context = { mongo, user }
        const userInput = { username: "", password: "wrongPass" }
        try {
          await resolvers.Mutation.updateUser(null, { userInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ password: ["Password does not match."] })
        }
      })
      it("email is empty", async ()=> {
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
          expect(e.state).toEqual({ email: ["Invalid email."] })
        }
      })
      it("email is not an email", async () => {
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
      it("newPassword is empty", async () => {
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
          expect(e.state).toEqual({ newPassword: ["Invalid newPassword."] })
        }
      })
      it("newPassword is invalid", async () => {
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
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ newPassword: ["Password is too weak."] })
        }
      })
    })
  })
})
