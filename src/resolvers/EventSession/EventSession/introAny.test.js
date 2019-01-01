import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { eventModelData, eventSessionData } from "../../../testUtils/fixtures"

let mongo

describe("EventSession EventSession resolvers", () => {
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

  describe("introAny", () => {
    it("returns eventSession", async () => {
      await mongo.loadEventModels()
      await mongo.loadEventSessions()
      const context = { mongo }
      const response = await resolvers.EventSession.introAny(eventSessionData[1], null, context)
      expect(response).toEqual(eventSessionData[1].intro)
    })

    it("returns the eventModel intro", async () => {
      await mongo.loadEventModels()
      await mongo.loadEventSessions()
      const context = { mongo }
      const response = await resolvers.EventSession.introAny(eventSessionData[0], null, context)
      expect(response).toEqual(eventModelData[0].intro)
    })
  })
})
