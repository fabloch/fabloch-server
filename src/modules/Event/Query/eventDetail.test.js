import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventData } from "../../../testUtils/fixtures"

let mongo

describe("Event Query resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("eventDetail", () => {
    it("returns the event from the id", async () => {
      await mongo.loadEvents()
      const context = { mongo }
      const response = await resolvers.Query.eventDetail(null, { id: "5a4a5eb6404da6d636078beb" }, context)
      expect(response).toEqual(eventData[0])
    })
    it("returns null if no event with that id", async () => {
      const context = { mongo }
      const response = await resolvers.Query.eventDetail(null, { id: "5a4a5eb6404da6d6360734eb" }, context)
      expect(response).toEqual(null)
    })
  })
})
