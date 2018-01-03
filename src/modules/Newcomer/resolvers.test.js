import { ObjectId } from "mongodb"
import resolvers from "./resolvers"
import connectMongo from "../../testUtils/mongoTest"
import { newcomerData } from "../../testUtils/fixtures"

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
      it("creates ob with random url & digit", async () => {
        const context = { mongo }
        const newcomer = { email: "user1@example.com" }
        const response = await resolvers.Mutation.createNewcomer(null, { newcomer }, context)
        expect(response.email).toEqual("user1@example.com")
        expect(response.digits).toEqual([5, 5, 5, 5, 5, 5])
      })
      it("raises an error if email already exists in Newcomers", async () => {
        expect.assertions(1)
        await mongo.loadNewcomers()
        const context = { mongo }
        const newcomer = { email: "user1@example.com" }
        try {
          await resolvers.Mutation.createNewcomer(null, { newcomer }, context)
        } catch (e) {
          expect(e.message).toEqual("Email already in newcomers.")
        }
      })
      it("raises an error if email already exists in Users", async () => {
        expect.assertions(1)
        await mongo.loadUsers()
        const context = { mongo }
        const newcomer = { email: "user1@example.com" }
        try {
          await resolvers.Mutation.createNewcomer(null, { newcomer }, context)
        } catch (e) {
          expect(e.message).toEqual("Email already in users.")
        }
      })
    })
  })
  describe("checkNewcomerDigits", () => {})
})
