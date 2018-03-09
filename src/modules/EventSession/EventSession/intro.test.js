import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventModelData, eventSessionData } from "../../../testUtils/fixtures"

let mongo


describe("EventSession EventSession resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("intro", () => {
    it("returns the eventModel intro (eventSession0A)", async () => {
      await mongo.loadEventModels()
      await mongo.loadPlaces()
      const context = { mongo }
      const response = await resolvers.EventSession.intro(eventSessionData[0], null, context)
      expect(response).toEqual(eventModelData[0].intro)
    })
    it("returns the eventSession intro (eventSession0B)", async () => {
      await mongo.loadEventModels()
      await mongo.loadPlaces()
      const context = { mongo }
      const response = await resolvers.EventSession.intro(eventSessionData[1], null, context)
      expect(response).toEqual(eventSessionData[1].introSuper)
    })
  })
})
