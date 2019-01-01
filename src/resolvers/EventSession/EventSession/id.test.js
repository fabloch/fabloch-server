import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { eventSessionData } from "../../../testUtils/fixtures"

let mongo

describe("EventSession EventSession resolvers", () => {
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
    it("returns _id from db", () => {
      expect(resolvers.EventSession.id(eventSessionData[0])).toEqual("5a95c520c14e2a0ce4eea6f5")
    })
  })
})
