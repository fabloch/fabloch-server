import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventCatData, eventSessionData } from "../../../testUtils/fixtures"

let mongo

describe("EventSession Query resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("eventCatSessionList", () => {
    it("returns all eventSessions from db", async () => {
      await mongo.loadEventModels()
      await mongo.loadEventSessions()
      const context = { mongo }
      const eventCatId = eventCatData[0]._id.toString()
      const response = await resolvers.Query.eventCatSessionList(null, { eventCatId }, context)
      expect(response).toEqual([
        eventSessionData[4],
        eventSessionData[0],
        eventSessionData[5],
        eventSessionData[1],
      ])
    })
  })
})
