import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, mediaData } from "../../../testUtils/fixtures"

let mongo

describe("deleteMedia", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("valid", async () => {
    it("returns true", async () => {
      await mongo.loadMedias()
      const user = admin
      const context = { mongo, user }
      const mediaId = mediaData[0]._id.toString()
      expect(await mongo.Medias.find({}).toArray()).toHaveLength(9)
      const response = await resolvers.Mutation.deleteMedia(null, { mediaId }, context)
      expect(response).toBeTruthy()
      expect(await mongo.Medias.find({}).toArray()).toHaveLength(8)
    })
  })
})
