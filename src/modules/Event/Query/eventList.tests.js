import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventData, eventTicketData, userData } from "../../../testUtils/fixtures"

let mongo

describe("Event Query resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("eventList", () => {
    describe("no filters", () => {
      it("returns empty array if no events", async () => {
        const context = { mongo }
        const response = await resolvers.Query.eventList(null, {}, context)
        expect(response).toEqual([])
      })
      it("returns all events from db", async () => {
        await mongo.loadEvents()
        const context = { mongo }
        const response = await resolvers.Query.eventList(null, {}, context)
        expect(response).toEqual(eventData)
      })
    })
    describe("with filters", () => {
      it("filters with the title", async () => {
        await mongo.loadEvents()
        const context = { mongo }
        /* eslint-disable camelcase */
        const filter = {
          OR: [
            { title_contains: "awesome" },
            { description_contains: "awesome" },
          ],
        }
        /* eslint-enable */

        const response = await resolvers.Query.eventList(null, { filter }, context)
        expect(response).toEqual([eventData[1]])
      })
    })
  })
})
