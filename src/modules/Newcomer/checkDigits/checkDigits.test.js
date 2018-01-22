import { ObjectId } from "mongodb"
import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { newcomerData, userData } from "../../../testUtils/fixtures"
import mailer from "../../../testUtils/mockMailer"

let mongo

const mockMath = Object.create(global.Math)
mockMath.random = () => 0.55
global.Math = mockMath

describe("Newcomer Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("checkDigits", () => {
    it("returns the newcomer", async () => {
      await mongo.loadNewcomers()
      const context = { mongo, mailer }
      const newcomer = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIzQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE1ODQ0OTI1fQ.mNeqSHD4dT1FTfieci5fZGxktUWoiKXt2F4zGCTsYQo",
        digits: [5, 5, 5, 5, 5, 5],
      }
      const response = await resolvers.Mutation.checkDigits(null, { newcomer }, context)
      expect(response.email).toEqual("user3@example.com")
    })
    it("raises error if token invalid", async () => {
      expect.assertions(2)
      const context = { mongo, mailer }
      const newcomer = {
        token: "WrOng_ToKeN",
        digits: [5, 5, 5, 5, 5, 5],
      }
      try {
        await resolvers.Mutation.checkDigits(null, { newcomer }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Invalid token."] })
      }
    })
    it("raises error if token valid but no user", async () => {
      expect.assertions(2)
      const context = { mongo, mailer }
      const newcomer = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIzQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE1ODQ0OTI1fQ.mNeqSHD4dT1FTfieci5fZGxktUWoiKXt2F4zGCTsYQo",
        digits: [5, 5, 5, 5, 5, 5],
      }
      try {
        await resolvers.Mutation.checkDigits(null, { newcomer }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Newcomer doesn't exist."] })
      }
    })
    it("raises error if digits dont match", async () => {
      expect.assertions(2)
      await mongo.loadNewcomers()
      const context = { mongo, mailer }
      const newcomer = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIzQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE1ODQ0OTI1fQ.mNeqSHD4dT1FTfieci5fZGxktUWoiKXt2F4zGCTsYQo",
        digits: [5, 5, 5, 5, 5, 4],
      }
      try {
        await resolvers.Mutation.checkDigits(null, { newcomer }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Digits don't match."] })
      }
    })
  })
})
