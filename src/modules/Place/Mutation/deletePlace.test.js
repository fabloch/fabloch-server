import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, placeData, userData } from "../../../testUtils/fixtures"

let mongo

describe("Place Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("deletePlace", async () => {
    it("deletes a place", async () => {
      await mongo.loadPlaces()
      const user = admin
      const context = { mongo, user }
      const placeId = placeData[0]._id.toString()
      await resolvers.Mutation.deletePlace(null, { placeId }, context)
      expect(await mongo.Places.find().toArray()).toHaveLength(2)
    })
    it("raises an error if no user in context", async () => {
      expect.assertions(2)
      const user = null
      const context = { mongo, user }
      const placeId = placeData[0]._id.toString()
      try {
        await resolvers.Mutation.deletePlace(null, { placeId }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Unauthenticated."] })
      }
    })
    it("raises error if not admin", async () => {
      expect.assertions(2)
      const user = userData[0]
      const context = { mongo, user }
      const placeId = placeData[0]._id.toString()
      try {
        await resolvers.Mutation.deletePlace(null, { placeId }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Not allowed."] })
      }
    })
  })
})
