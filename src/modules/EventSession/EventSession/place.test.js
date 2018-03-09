import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventSessionData, placeData } from "../../../testUtils/fixtures"

let mongo


describe("EventSession EventSession resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("place", () => {
    it("returns the eventModel place (eventSession0A)", async () => {
      await mongo.loadEventModels()
      await mongo.loadPlaces()
      const context = { mongo }
      const response = await resolvers.EventSession.place(eventSessionData[0], null, context)
      expect(response).toEqual(placeData[0])
    })
    it("returns the eventSession place (eventSession0B)", async () => {
      await mongo.loadEventModels()
      await mongo.loadPlaces()
      const context = { mongo }
      const response = await resolvers.EventSession.place(eventSessionData[1], null, context)
      expect(response).toEqual(placeData[1])
    })
    it("returns null if neither eventSession or evenModel have place", async () => {
      await mongo.loadEventModels()
      await mongo.loadPlaces()
      const context = { mongo }
      const response = await resolvers.EventSession.place(eventSessionData[2], null, context)
      expect(response).toEqual(null)
    })
  })
})
