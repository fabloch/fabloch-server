import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, userData } from "../../../testUtils/fixtures"

let mongo

describe("User Mutation updateUserAdmin", () => {
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

  describe("success", () => {
    it("updates email, username, fullName and password", async () => {
      await mongo.loadUsers()
      const user = admin
      const context = { mongo, user }
      const userInput = {
        id: userData[0]._id.toString(),
        email: "another@email.com",
        username: "another_username",
        newPassword: "Thi$Is!UnN0uveauMot2Passe!",
        fullName: "Another Name",
      }
      const response = await resolvers.Mutation.updateUserAdmin(null, { userInput }, context)
      expect(response).toMatchObject({
        email: "another@email.com",
        username: "another_username",
        fullName: "Another Name",
        picUrl: "https://s3-eu-west-1.amazonaws.com/fabloch-dev/sample/profile_banksy.jpg",
      })
      const passwordValid = await bcrypt.compare(userInput.newPassword, response.password)
      expect(passwordValid).toBeTruthy()
      expect(response.version).toEqual(1)
    })
  })
  describe("error", () => {
    it("raises if not authenticated", async () => {
      expect.assertions(1)
      const user = null
      const context = { mongo, user }
      const userInput = {
        id: userData[0]._id.toString(),
        email: "speaker@example.com",
        username: "speaker",
        password: "Mot2pa$$e.De.Ouf",
        fullName: "Speaker Example",
      }
      try {
        await resolvers.Mutation.updateUserAdmin(null, { userInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated.")
      }
    })
    it("raises if not admin", async () => {
      expect.assertions(1)
      const user = userData[0]
      const context = { mongo, user }
      const userInput = {
        id: userData[0]._id.toString(),
        email: "speaker@example.com",
        username: "speaker",
        password: "Mot2pa$$e.De.Ouf",
        fullName: "Speaker Example",
      }
      try {
        await resolvers.Mutation.updateUserAdmin(null, { userInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated as admin.")
      }
    })
    it("raises error if email taken", async () => {
      expect.assertions(2)
      await mongo.loadUsers()
      const user = admin
      const context = { mongo, user }
      const userInput = {
        id: userData[0]._id.toString(),
        email: "user2@example.com",
        username: "speaker",
        fullName: "Speaker Example",
      }
      try {
        await resolvers.Mutation.updateUserAdmin(null, { userInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to update user.")
        expect(e.validationErrors).toEqual({ email: ["Email is already taken."] })
      }
    })
    it("raises error if username taken", async () => {
      expect.assertions(2)
      await mongo.loadUsers()
      const user = admin
      const context = { mongo, user }
      const userInput = {
        id: userData[0]._id.toString(),
        email: "speaker@example.com",
        username: "user2",
        fullName: "Speaker Example",
      }
      try {
        await resolvers.Mutation.updateUserAdmin(null, { userInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to update user.")
        expect(e.validationErrors).toEqual({ username: ["Username is already taken."] })
      }
    })
    it("raises error if username not in lowercase", async () => {
      expect.assertions(2)
      await mongo.loadUsers()
      const user = admin
      const context = { mongo, user }
      const userInput = {
        id: userData[0]._id.toString(),
        email: "speaker@example.com",
        username: "Speaker",
        password: "Mot2pa$$e.De.Ouf",
        fullName: "Speaker Example",
      }
      try {
        await resolvers.Mutation.updateUserAdmin(null, { userInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to update user.")
        expect(e.validationErrors).toEqual({
          username: [
            "Username should only container lowercase letters, numbers, dashes or underscores.",
          ],
        })
      }
    })
    it("raises error if username has a space", async () => {
      expect.assertions(2)
      await mongo.loadUsers()
      const user = admin
      const context = { mongo, user }
      const userInput = {
        id: userData[0]._id.toString(),
        email: "speaker@example.com",
        username: "speaker withspace",
        password: "Mot2pa$$e.De.Ouf",
        fullName: "Speaker Example",
      }
      try {
        await resolvers.Mutation.updateUserAdmin(null, { userInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to update user.")
        expect(e.validationErrors).toEqual({
          username: [
            "Username should only container lowercase letters, numbers, dashes or underscores.",
          ],
        })
      }
    })
    it("raises error if username has special char", async () => {
      expect.assertions(2)
      await mongo.loadUsers()
      const user = admin
      const context = { mongo, user }
      const userInput = {
        id: userData[0]._id.toString(),
        email: "speaker@example.com",
        username: "$peaker",
        password: "Mot2pa$$e.De.Ouf",
        fullName: "Speaker Example",
      }
      try {
        await resolvers.Mutation.updateUserAdmin(null, { userInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to update user.")
        expect(e.validationErrors).toEqual({
          username: [
            "Username should only container lowercase letters, numbers, dashes or underscores.",
          ],
        })
      }
    })
    it("raises an error if password length too small", async () => {
      expect.assertions(2)
      await mongo.loadUsers()
      const user = admin
      const context = { mongo, user }
      const userInput = {
        id: userData[0]._id.toString(),
        email: "speaker@example.com",
        username: "speaker",
        newPassword: "pass",
        fullName: "Speaker Example",
      }
      try {
        await resolvers.Mutation.updateUserAdmin(null, { userInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to update user.")
        expect(e.validationErrors).toEqual({
          newPassword: ["Password must have length between 6 and 48 chars."],
        })
      }
    })
  })
})
