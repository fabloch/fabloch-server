import { ObjectId } from "mongodb"
import moment from "moment"
import resolvers from "./resolvers"
import connectMongo from "../../testUtils/mongoTest"
import { userData, membershipData, dateUtils } from "../../testUtils/fixtures"

let mongo

describe("Membership Membership resolvers", () => {
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

  describe("id", () => {
    it("returns the id stringified", () => {
      expect(resolvers.Membership.id(membershipData[0])).toEqual("5a383f36d2834c317755ab17")
    })
  })
  describe("start, end", () => {
    it("returns a date string from datetime", () => {
      expect(resolvers.Membership.start(membershipData[0])).toEqual(
        moment(dateUtils.user1membership1Start).format("YYYY-MM-DD"),
      )
      expect(resolvers.Membership.end(membershipData[0])).toEqual(
        moment(dateUtils.user1membership1End).format("YYYY-MM-DD"),
      )
    })
  })
  describe("owner", () => {
    it("returns the owner", async () => {
      await mongo.loadUsers()
      const context = { mongo }
      const response = await resolvers.Membership.owner(membershipData[0], null, context)
      expect(response).toEqual(userData[0])
    })
  })
})
