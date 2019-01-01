import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, mediaData, userData } from "../../../testUtils/fixtures"

let mongo

describe("Media Query mediaList", () => {
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

  describe("positive", () => {
    it("returns all Medias", async () => {
      await mongo.loadMedias()
      const user = admin
      const context = { mongo, user }
      const response = await resolvers.Query.mediaList(null, { all: true }, context)
      expect(response).toEqual(mediaData)
    })
    it("returns null if no Medias", async () => {
      const user = admin
      const context = { mongo, user }
      const response = await resolvers.Query.mediaList(null, null, context)
      expect(response).toEqual([])
    })
  })
  describe("negative", () => {
    it("raises if not authenticated", async () => {
      expect.assertions(1)
      const user = null
      const context = { mongo, user }
      try {
        await resolvers.Query.mediaList(null, null, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated.")
      }
    })
    it("raises if not admin", async () => {
      expect.assertions(1)
      const user = userData[0]
      const context = { mongo, user }
      try {
        await resolvers.Query.mediaList(null, null, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated as admin.")
      }
    })
  })
})
