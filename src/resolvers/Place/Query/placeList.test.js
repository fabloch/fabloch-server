import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { placeData } from "../../../testUtils/fixtures"

let mongo

describe("Place Query resolvers", () => {
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

  describe("placeList", () => {
    it("returns all Places", async () => {
      await mongo.loadPlaces()
      const context = { mongo }
      const response = await resolvers.Query.placeList(null, { all: true }, context)
      expect(response).toEqual(placeData)
    })
    it("returns published Places if published true", async () => {
      await mongo.loadPlaces()
      const context = { mongo }
      const response = await resolvers.Query.placeList(null, null, context)
      expect(response).toEqual([placeData[0], placeData[1]])
    })
    it("returns null if no Places", async () => {
      const context = { mongo }
      const response = await resolvers.Query.placeList(null, null, context)
      expect(response).toEqual([])
    })
  })
})
