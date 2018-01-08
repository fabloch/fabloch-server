import { ObjectId } from "mongodb"
import resolvers from "./resolvers"
import connectMongo from "../../testUtils/mongoTest"
import { eventData, eventTicketData, userData } from "../../testUtils/fixtures"

let mongo

describe("Event Query resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("allEvents", () => {
    describe("no filters", () => {
      it("returns empty array if no events", async () => {
        const context = { mongo }
        const response = await resolvers.Query.allEvents(null, {}, context)
        expect(response).toEqual([])
      })
      it("returns all events from db", async () => {
        await mongo.loadEvents()
        const context = { mongo }
        const response = await resolvers.Query.allEvents(null, {}, context)
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

        const response = await resolvers.Query.allEvents(null, { filter }, context)
        expect(response).toEqual([eventData[1]])
      })
    })
  })
  describe("eventDetail", () => {
    it("returns the event from the id", async () => {
      await mongo.loadEvents()
      const context = { mongo }
      const response = await resolvers.Query.eventDetail(null, { id: "5a4a5eb6404da6d636078beb" }, context)
      expect(response).toEqual(eventData[0])
    })
  })
  it("throws an error if no event with that id", async () => {
    const context = { mongo }
    try {
      await resolvers.Query.eventDetail(null, { id: "5a4a5eb6404da6d6360734eb" }, context)
    } catch (e) {
      expect(e.message).toEqual("Event does not exist.")
    }
  })
})
