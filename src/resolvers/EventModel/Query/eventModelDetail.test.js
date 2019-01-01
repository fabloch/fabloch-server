import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { eventModelData } from "../../../testUtils/fixtures"

let mongo

describe("EventModel Query resolvers", () => {
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

  describe("eventModelDetail", () => {
    it("returns the eventModel from the id", async () => {
      await mongo.loadEventModels()
      const context = { mongo }
      const response = await resolvers.Query.eventModelDetail(
        null,
        { id: "5a4a5eb6404da6d636078beb" },
        context,
      )
      expect(response).toEqual(eventModelData[0])
    })
    it("returns null if no eventModel with that id", async () => {
      const context = { mongo }
      const response = await resolvers.Query.eventModelDetail(
        null,
        { id: "5a4a5eb6404da6d6360734eb" },
        context,
      )
      expect(response).toEqual(null)
    })
  })
})
