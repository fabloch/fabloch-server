import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventSessionData, placeData } from "../../../testUtils/fixtures"

let mongo


describe("EventSession EventSession resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("placeAny", () => {
    it("returns the eventSession place", async () => {
      await mongo.loadPlaces()
      const context = { mongo }
      const response = await resolvers.EventSession.placeAny(eventSessionData[1], null, context)
      expect(response).toEqual(placeData[1])
    })
    it("returns the eventModel place", async () => {
      await mongo.loadEventModels()
      await mongo.loadPlaces()
      const context = { mongo }
      const response = await resolvers.EventSession.placeAny(eventSessionData[0], null, context)
      expect(response).toEqual(placeData[0])
    })
  })
})
