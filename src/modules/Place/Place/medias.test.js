import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { placeData, mediaData, userData } from "../../../testUtils/fixtures"

let mongo

describe("Place Place resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("medias", () => {
    it("returns the linked medias", async () => {
      await mongo.loadMedias()
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.Place.medias(placeData[0], null, context)
      expect(response).toEqual([mediaData[6], mediaData[7], mediaData[8]])
    })
    it("returns null if no linked media", async () => {
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.Place.medias(placeData[0], null, context)
      expect(response).toEqual([])
    })
  })
})
