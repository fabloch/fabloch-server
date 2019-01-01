import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { eventSessionData, eventModelData, userData } from "../../../testUtils/fixtures"

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

  describe("eventCatsAny", () => {
    it("returns eventModel eventCatsAny", async () => {
      await mongo.loadEventModels()
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventSession.eventCatsAny(eventSessionData[1], null, context)
      expect(response).toEqual(eventModelData[0].eventCats)
    })
    it("returns eventModel and eventSession eventCats", async () => {
      await mongo.loadEventModels()
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventSession.eventCatsAny(eventSessionData[0], null, context)
      expect(response).toEqual([...eventModelData[0].eventCats, ...eventSessionData[0].eventCats])
    })
  })
})
