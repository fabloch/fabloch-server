import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventCatData } from "../../../testUtils/fixtures"

let mongo

describe("EventCat Query resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("eventCatList", () => {
    it("returns all EventCats in alphabetical order", async () => {
      await mongo.loadEventCats()
      const context = { mongo }
      const response = await resolvers.Query.eventCatList(null, null, context)
      expect(response).toEqual([eventCatData[0], eventCatData[2], eventCatData[1], eventCatData[3]])
    })
    it("returns null if no EventCats", async () => {
      const context = { mongo }
      const response = await resolvers.Query.eventCatList(null, null, context)
      expect(response).toEqual([])
    })
  })
})
