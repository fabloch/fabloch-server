import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventModelData, eventSessionData } from "../../../testUtils/fixtures"

let mongo


describe("EventSession EventSession resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("descriptionPrnt", () => {
    it("returns the eventModel descriptionPrnt (eventSession0A)", async () => {
      await mongo.loadEventModels()
      const context = { mongo }
      const response = await resolvers.EventSession
        .descriptionPrnt(eventSessionData[0], null, context)
      expect(response).toEqual(eventModelData[0].description)
    })
  })
})
