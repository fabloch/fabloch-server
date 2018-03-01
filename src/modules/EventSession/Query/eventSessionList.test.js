import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventSessionData } from "../../../testUtils/fixtures"

let mongo

describe("EventSession Query resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("eventSessionList", () => {
    describe("no filters", () => {
      it("returns empty array if no eventSessions", async () => {
        const context = { mongo }
        const response = await resolvers.Query.eventSessionList(null, {}, context)
        expect(response).toEqual([])
      })
      it("returns all eventSessions from db", async () => {
        await mongo.loadEventSessions()
        const context = { mongo }
        const response = await resolvers.Query.eventSessionList(null, {}, context)
        expect(response).toEqual(eventSessionData)
      })
    })
    // describe("with filters", () => {
    //   it("filters with the title", async () => {
    //     await mongo.loadEventSessions()
    //     const context = { mongo }
    //     /* eslint-disable camelcase */
    //     const filter = {
    //       OR: [
    //         { title_contains: "EventModel 0" },
    //         { description_contains: "awesome" },
    //       ],
    //     }
    //     /* eslint-enable */
    //
    //     const response = await resolvers.Query.eventSessionList(null, { filter }, context)
    //     expect(response).toEqual([eventSessionData[1]])
    //   })
    // })
  })
})
