import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, mediaData, userData } from "../../../testUtils/fixtures"

let mongo

describe("deleteMedia", () => {
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

  describe("valid", () => {
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
  describe("invalid", () => {
    it("raises if no user in context", async () => {
      expect.assertions(1)
      await mongo.loadMedias()
      const context = { mongo }
      const mediaId = mediaData[0]._id.toString()
      try {
        await resolvers.Mutation.deleteMedia(null, { mediaId }, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated.")
      }
    })
    it("raises if user is not admin", async () => {
      expect.assertions(1)
      await mongo.loadMedias()
      const user = userData[0]
      const context = { mongo, user }
      const mediaId = mediaData[0]._id.toString()
      try {
        await resolvers.Mutation.deleteMedia(null, { mediaId }, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated as admin.")
      }
    })
  })
})
