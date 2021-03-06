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

  describe("titleAny", () => {
    it("returns eventSession", async () => {
      await mongo.loadEventModels()
      await mongo.loadEventSessions()
      const context = { mongo }
      const response = await resolvers.EventSession.titleAny(eventSessionData[1], null, context)
      expect(response).toEqual(eventSessionData[1].title)
    })

    it("returns the eventModel title", async () => {
      await mongo.loadEventModels()
      await mongo.loadEventSessions()
      const context = { mongo }
      const response = await resolvers.EventSession.titleAny(eventSessionData[0], null, context)
      expect(response).toEqual(eventModelData[0].title)
    })
  })
})
