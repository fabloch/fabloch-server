import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { eventModelData, eventSessionData } from "../../../testUtils/fixtures"

let mongo


describe("EventSession EventSession resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("seatsPrnt", () => {
    describe("no override", () => {
      it("returns the eventModel seatsPrnt (eventSession0A)", async () => {
        await mongo.loadEventModels()
        await mongo.loadPlaces()
        const context = { mongo }
        const response = await resolvers.EventSession.seatsPrnt(eventSessionData[0], null, context)
        expect(response).toEqual(eventModelData[0].seats)
      })
    })
    it("returns null if evenModel has no seatsPrnt", async () => {
      await mongo.loadEventModels()
      await mongo.loadPlaces()
      const context = { mongo }
      const response = await resolvers.EventSession.seatsPrnt(eventSessionData[2], null, context)
      expect(response).toBeFalsy()
    })
  })
})
