import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { eventModelData, mediaData, userData } from "../../../testUtils/fixtures"

let mongo

describe("EventModel EventModel resolvers", () => {
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

  describe("medias", () => {
    it("returns the linked medias", async () => {
      await mongo.loadMedias()
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventModel.medias(eventModelData[0], null, context)
      expect(response).toEqual([mediaData[0], mediaData[1], mediaData[2], mediaData[3]])
    })
    it("returns null if no linked media", async () => {
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventModel.medias(eventModelData[0], null, context)
      expect(response).toEqual([])
    })
  })
})
