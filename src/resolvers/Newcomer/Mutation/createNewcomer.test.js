import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { newcomerData } from "../../../testUtils/fixtures"
import mailer from "../../../mailer"

let mongo

const mockMath = Object.create(global.Math)
mockMath.random = () => 0.55
global.Math = mockMath

describe("Newcomer Mutation resolvers", () => {
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

  describe("createNewcomer", () => {
    it("creates newcomer with random url & digit", async () => {
      const context = { mongo, mailer }
      const newcomerInput = { email: "user1@example.com" }
      const response = await resolvers.Mutation.createNewcomer(null, { newcomerInput }, context)
      expect(response.email).toEqual("user1@example.com")
      expect(response.token).toMatch(/ey.+/)
      expect(response.digits).toEqual([5, 5, 5, 5, 5, 5])
      expect(response.valid).toBeFalsy()
    })
    it("updates newcomer if email already exists", async () => {
      await mongo.loadNewcomers()
      const context = { mongo, mailer }
      const newcomerInput = { email: "user3@example.com" }
      const response = await resolvers.Mutation.createNewcomer(null, { newcomerInput }, context)
      expect(response._id).toEqual(newcomerData[0]._id)
      expect(response.email).toEqual("user3@example.com")
      expect(response.token).toMatch(/ey.+/)
      expect(response.digits).toEqual([5, 5, 5, 5, 5, 5])
      expect(response.resent).toEqual(true)
      expect(response.valid).toBeFalsy()
    })
    it("raises an error if no email", async () => {
      expect.assertions(2)
      await mongo.loadUsers()
      const context = { mongo, mailer }
      const newcomerInput = { email: "" }
      try {
        await resolvers.Mutation.createNewcomer(null, { newcomerInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to save newcomer.")
        expect(e.validationErrors).toEqual({ email: ["Email is missing."] })
      }
    })
    it("raises an error if invalid email", async () => {
      expect.assertions(2)
      await mongo.loadUsers()
      const context = { mongo, mailer }
      const newcomerInput = { email: "wrongEmail" }
      try {
        await resolvers.Mutation.createNewcomer(null, { newcomerInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to save newcomer.")
        expect(e.validationErrors).toEqual({ email: ["Email is not valid."] })
      }
    })
    it("raises an error if email already exists in Users", async () => {
      expect.assertions(2)
      await mongo.loadUsers()
      const context = { mongo, mailer }
      const newcomerInput = { email: "user1@example.com" }
      try {
        await resolvers.Mutation.createNewcomer(null, { newcomerInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to save newcomer.")
        expect(e.validationErrors).toEqual({ email: ["A user already exists with this email."] })
      }
    })
  })
})
