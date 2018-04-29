import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventSessionData, mediaData, userData } from "../../../testUtils/fixtures"

let mongo

describe("EventSession EventSession resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("mediasAny", () => {
    it("returns EventModel medias if no override", async () => {
      await mongo.loadMedias()
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventSession.mediasAny(eventSessionData[0], null, context)
      expect(response).toEqual([mediaData[0], mediaData[1], mediaData[2], mediaData[3]])
    })
    it("returns all Medias starting with EventSession ones", async () => {
      await mongo.loadMedias()
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventSession.mediasAny(eventSessionData[1], null, context)
      expect(response).toEqual([
        mediaData[4],
        mediaData[5],
        mediaData[0],
        mediaData[1],
        mediaData[2],
        mediaData[3],
      ])
    })
    it("returns null if no linked media", async () => {
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventSession.medias(eventSessionData[2], null, context)
      expect(response).toEqual([])
    })
  })
})
