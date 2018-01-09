import resolvers from "./resolvers"
import connectMongo from "../../testUtils/mongoTest"
import { newcomerData } from "../../testUtils/fixtures"
import mailer from "../../testUtils/mockMailer"

let mongo

const mockMath = Object.create(global.Math)
mockMath.random = () => 0.55
global.Math = mockMath

describe("Newcomer Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("createNewcomer", () => {
    it("creates newcomer with random url & digit", async () => {
      const context = { mongo, mailer }
      const newcomer = { email: "user1@example.com" }
      const response = await resolvers.Mutation.createNewcomer(null, { newcomer }, context)
      expect(response.email).toEqual("user1@example.com")
      expect(response.digits).toEqual([5, 5, 5, 5, 5, 5])
    })
    it("updates newcomer if email already exists", async () => {
      await mongo.loadNewcomers()
      const context = { mongo, mailer }
      const newcomer = { email: "user1@example.com" }
      const response = await resolvers.Mutation.createNewcomer(null, { newcomer }, context)
      expect(response._id).toEqual(newcomerData[0]._id)
      expect(response.email).toEqual("user1@example.com")
      expect(response.digits).toEqual([5, 5, 5, 5, 5, 5])
      expect(response.resent).toEqual(true)
    })
    it("raises an error if email already exists in Users", async () => {
      expect.assertions(1)
      await mongo.loadUsers()
      const context = { mongo, mailer }
      const newcomer = { email: "user1@example.com" }
      try {
        await resolvers.Mutation.createNewcomer(null, { newcomer }, context)
      } catch (e) {
        expect(e.message).toEqual("A user already exists with this email.")
      }
    })
  })

  describe("checkDigits", () => {
    it("returns the newcomer", async () => {
      await mongo.loadNewcomers()
      const context = { mongo, mailer }
      const newcomer = { id: "5a4b76d5fdea180e9295743c", digits: [5, 5, 5, 5, 5, 5] }
      const response = await resolvers.Mutation.checkDigits(null, { newcomer }, context)
      expect(response.email).toEqual("user1@example.com")
    })
    it("raises error if no newcomer with that id", async () => {
      expect.assertions(1)
      const context = { mongo, mailer }
      const newcomer = { id: "5a4b76d5fdea180e9295743c", digits: [5, 5, 5, 5, 5, 5] }
      try {
        await resolvers.Mutation.checkDigits(null, { newcomer }, context)
      } catch (e) {
        expect(e.message).toEqual("Newcomer with that id doesn't exist.")
      }
    })
    it("raises error if digits dont match", async () => {
      expect.assertions(1)
      await mongo.loadNewcomers()
      const context = { mongo, mailer }
      const newcomer = { id: "5a4b76d5fdea180e9295743c", digits: [5, 5, 5, 5, 5, 4] }
      try {
        await resolvers.Mutation.checkDigits(null, { newcomer }, context)
      } catch (e) {
        expect(e.message).toEqual("Digits don't match.")
      }
    })
  })
})