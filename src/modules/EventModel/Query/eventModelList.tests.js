import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventModelData, eventTicketData, userData } from "../../../testUtils/fixtures"

let mongo

describe("EventModel Query resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("eventModelList", () => {
    describe("no filters", () => {
      it("returns empty array if no eventModels", async () => {
        const context = { mongo }
        const response = await resolvers.Query.eventModelList(null, {}, context)
        expect(response).toEqual([])
      })
      it("returns all eventModels from db", async () => {
        await mongo.loadEventModels()
        const context = { mongo }
        const response = await resolvers.Query.eventModelList(null, {}, context)
        expect(response).toEqual(eventModelData)
      })
    })
    describe("with filters", () => {
      it("filters with the title", async () => {
        await mongo.loadEventModels()
        const context = { mongo }
        /* eslint-disable camelcase */
        const filter = {
          OR: [
            { title_contains: "awesome" },
            { description_contains: "awesome" },
          ],
        }
        /* eslint-enable */

        const response = await resolvers.Query.eventModelList(null, { filter }, context)
        expect(response).toEqual([eventModelData[1]])
      })
    })
  })
})
