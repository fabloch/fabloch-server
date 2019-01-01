import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, placeData, userData } from "../../../testUtils/fixtures"

let mongo

describe("Place Mutation resolvers", () => {
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

  describe("deletePlace", () => {
    it("deletes a place", async () => {
      await mongo.loadPlaces()
      const context = { mongo, user: admin }
      const placeId = placeData[0]._id.toString()
      await resolvers.Mutation.deletePlace(null, { placeId }, context)
      expect(await mongo.Places.find().toArray()).toHaveLength(2)
    })
    it("raises an error if no user in context", async () => {
      expect.assertions(1)
      const user = null
      const context = { mongo, user }
      const placeId = placeData[0]._id.toString()
      try {
        await resolvers.Mutation.deletePlace(null, { placeId }, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated.")
      }
    })
    it("raises error if not admin", async () => {
      expect.assertions(1)
      const user = userData[0]
      const context = { mongo, user }
      const placeId = placeData[0]._id.toString()
      try {
        await resolvers.Mutation.deletePlace(null, { placeId }, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated as admin.")
      }
    })
  })
})
