import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventModelData, placeData } from "../../../testUtils/fixtures"

let mongo

describe("EventModel EventModel resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("place", () => {
    it("returns the linked place", async () => {
      await mongo.loadPlaces()
      const context = { mongo }
      const response = await resolvers.EventModel.place(eventModelData[0], null, context)
      expect(response).toEqual(placeData[0])
    })
    it("returns null if no linked place", async () => {
      await mongo.loadPlaces()
      const context = { mongo }
      const response = await resolvers.EventModel.place(eventModelData[0], null, context)
      expect(response).toEqual(placeData[0])
    })
  })
})
