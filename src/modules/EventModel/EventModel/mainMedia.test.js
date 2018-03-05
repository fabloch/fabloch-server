import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventModelData, mediaData, userData } from "../../../testUtils/fixtures"

let mongo

describe("EventModel EventModel resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("mainMedia", () => {
    it("returns the linked media", async () => {
      await mongo.loadMedias()
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventModel.mainMedia(eventModelData[0], null, context)
      expect(response).toEqual(mediaData[0])
    })
    it("returns null if no linked media", async () => {
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventModel.mainMedia(eventModelData[0], null, context)
      expect(response).toEqual(null)
    })
  })
})
