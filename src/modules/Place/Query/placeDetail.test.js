import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { placeData } from "../../../testUtils/fixtures"

let mongo

describe("Place Query resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("placeDetail", () => {
    it("returns the place from the id", async () => {
      await mongo.loadPlaces()
      const context = { mongo }
      const id = placeData[0]._id.toString()
      const response = await resolvers.Query.placeDetail(null, { id }, context)
      expect(response).toEqual(placeData[0])
    })
    it("returns null if no place with that id", async () => {
      const context = { mongo }
      const id = placeData[0]._id.toString()
      const response = await resolvers.Query.placeDetail(null, { id }, context)
      expect(response).toEqual(null)
    })
  })
})
