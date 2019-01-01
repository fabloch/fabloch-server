import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { eventSessionData, userData } from "../../../testUtils/fixtures"

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

  describe("eventCats", () => {
    it("returns eventCats", async () => {
      await mongo.loadEventModels()
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventSession.eventCats(eventSessionData[0], null, context)
      expect(response).toEqual(eventSessionData[0].eventCats)
    })
    it("returns null if no eventCats", async () => {
      await mongo.loadEventModels()
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventSession.eventCats(eventSessionData[1], null, context)
      expect(response).toHaveLength(0)
    })
  })
})
