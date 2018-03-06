import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventModelData, eventSessionData } from "../../../testUtils/fixtures"

let mongo

describe("EventSession EventSession resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("seats", () => {
    describe("no override", () => {
      it("returns the eventModel seats (eventSession0A)", async () => {
        await mongo.loadEventModels()
        await mongo.loadPlaces()
        const context = { mongo }
        const response = await resolvers.EventSession.seats(eventSessionData[0], null, context)
        expect(response).toEqual(eventModelData[0].seats)
      })
    })
    describe("override", () => {
      it("returns the eventSession seats (eventSession0A)", async () => {
        await mongo.loadEventModels()
        await mongo.loadPlaces()
        const context = { mongo }
        const response = await resolvers.EventSession.seats(eventSessionData[1], null, context)
        expect(response).toEqual(eventSessionData[1].seats)
      })
    })
    it("returns null if neither eventSession or evenModel have seats", async () => {
      await mongo.loadEventModels()
      await mongo.loadPlaces()
      const context = { mongo }
      const response = await resolvers.EventSession.seats(eventSessionData[2], null, context)
      expect(response).toEqual(null)
    })
  })
})
