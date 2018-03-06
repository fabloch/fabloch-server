import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventSessionData, eventModelData } from "../../../testUtils/fixtures"

let mongo

describe("EventSession EventSession resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("model", () => {
    it("returns the eventModel is exists", async () => {
      await mongo.loadEventModels()
      const context = { mongo }
      const response = await resolvers.EventSession.model(eventSessionData[0], null, context)
      expect(response).toEqual(eventModelData[0])
    })
    it("returns null if no eventModel")
  })
})
