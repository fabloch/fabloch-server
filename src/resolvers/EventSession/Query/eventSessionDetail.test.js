import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { eventSessionData } from "../../../testUtils/fixtures"

let mongo

describe("EventSession Query resolvers", () => {
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

  describe("eventSessionDetail", () => {
    it("returns the eventSession from the id", async () => {
      await mongo.loadEventSessions()
      const context = { mongo }
      const id = eventSessionData[0]._id.toString()
      const response = await resolvers.Query.eventSessionDetail(null, { id }, context)
      expect(response).toEqual(eventSessionData[0])
    })
    it("returns null if no eventSession with that id", async () => {
      const context = { mongo }
      const id = "5a4a5eb6404da6d6360734eb"
      const response = await resolvers.Query.eventSessionDetail(null, { id }, context)
      expect(response).toEqual(null)
    })
  })
})
