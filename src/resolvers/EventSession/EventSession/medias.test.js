import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { eventSessionData, mediaData, userData } from "../../../testUtils/fixtures"

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

  describe("medias", () => {
    it("returns null if no direct Medias linked", async () => {
      await mongo.loadMedias()
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventSession.medias(eventSessionData[0], null, context)
      expect(response).toEqual([])
    })
    it("returns the linked medias if Medias linked", async () => {
      await mongo.loadMedias()
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventSession.medias(eventSessionData[1], null, context)
      expect(response).toEqual([mediaData[4], mediaData[5]])
    })
  })
})
