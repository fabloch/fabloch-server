import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventSessionData, mediaData, userData } from "../../../testUtils/fixtures"

let mongo

describe("EventSession EventSession resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("mainMedia", () => {
    describe("No override", () => {
      it("returns the parent eventModel's mainMedia", async () => {
        await mongo.loadMedias()
        const user = userData[0]
        const context = { mongo, user }
        const response = await resolvers.EventSession.mainMedia(eventSessionData[0], null, context)
        expect(response).toEqual(mediaData[0])
      })
    })

    describe("Overriden", () => {
      it("returns the eventSesion's mainMedia", async () => {
        await mongo.loadMedias()
        const user = userData[0]
        const context = { mongo, user }
        const response = await resolvers.EventSession.mainMedia(eventSessionData[1], null, context)
        expect(response).toEqual(mediaData[4])
      })
      it("returns null the parent eventModel has no mainMedia", async () => {
        const user = userData[0]
        const context = { mongo, user }
        const response = await resolvers.EventSession.mainMedia(eventSessionData[0], null, context)
        expect(response).toEqual(null)
      })
    })

    it("returns null if parent and eventSession have both no mainMedia", async () => {
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventSession.mainMedia(eventSessionData[3], null, context)
      expect(response).toEqual(null)
    })
  })
})
