import { ObjectId } from "mongodb"
import resolvers from "./resolvers"
import connectMongo from "../../testUtils/mongoTest"
import { newcomerData } from "../../testUtils/fixtures"
import mailer from "../../testUtils/mockMailer"

let mongo

const mockMath = Object.create(global.Math)
mockMath.random = () => 0.55
global.Math = mockMath

describe("Newcomer", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(() => mongo.afterEach())
  afterAll(async () => { await mongo.afterAll() })

  describe("Query", () => {
  })
  describe("Mutation", () => {
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
        expect(response.id).toEqual(newcomerData[0]._id.toString())
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
  })
  describe("newcomerExistsDigits", () => {
    describe("id attribute", () => {
      it("returns the _id stringified value", () => {
        const id = resolvers.Newcomer.id(newcomerData[0])
        expect(id).toEqual("5a4b76d5fdea180e9295743c")
      })
    })
    describe("digits", () => {
      it("returns an array of numbers", () => {
        const digits = resolvers.Newcomer.digits(newcomerData[0])
        expect(digits).toEqual([5, 5, 5, 5, 5, 5])
      })
    })
  })
})