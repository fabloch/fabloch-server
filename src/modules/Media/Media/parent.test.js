import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventModelData, eventSessionData, mediaData, placeData } from "../../../testUtils/fixtures"

let mongo

describe("Media Media resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("parent", () => {
    it("returns the parent eventModel", async () => {
      await mongo.loadEventModels()
      const context = { mongo }
      const response = await resolvers.Media.parent(mediaData[0], null, context)
      expect(response).toEqual(eventModelData[0])
    })
    it("returns the parent eventSession", async () => {
      await mongo.loadEventSessions()
      const context = { mongo }
      const response = await resolvers.Media.parent(mediaData[4], null, context)
      expect(response).toEqual(eventSessionData[1])
    })
    it("returns the parent place", async () => {
      await mongo.loadPlaces()
      const context = { mongo }
      const response = await resolvers.Media.parent(mediaData[6], null, context)
      expect(response).toEqual(placeData[0])
    })
  })
})
