import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventModelData, eventSessionData } from "../../../testUtils/fixtures"

let mongo

describe("EventSession Query resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("eventModelSessionList", () => {
    describe("no filters", () => {
      it("returns empty array if no eventSessions", async () => {
        await mongo.loadEventSessions()
        const context = { mongo }
        const eventModelId = eventModelData[0]._id.toString()
        const response = await resolvers.Query
          .eventModelSessionList(null, { eventModelId }, context)
        expect(response).toEqual([eventSessionData[0], eventSessionData[1], eventSessionData[4]])
      })
    })
  })
})
