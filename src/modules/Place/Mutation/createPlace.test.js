import { ObjectId } from "mongodb"
import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, placeData } from "../../../testUtils/fixtures"

let mongo

describe("Place Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("createPlace", async () => {
    it("creates a place", async () => {
      await mongo.loadUsers()
      const user = admin
      const context = { mongo, user }
      const placeInput = {
        title: "Awesome Place",
        street1: "1, rue du bout du monde",
        zipCode: "56430",
        city: "Erdeven",
        country: "France",
      }
      const response = await resolvers.Mutation.createPlace(null, { placeInput }, context)
      expect(response).toMatchObject(placeInput)
    })
    it("raises an error if no user in context", async () => {
      expect.assertions(2)
      const user = null
      const context = { mongo, user }
      const placeInput = { title: "Awesome Place" }
      try {
        await resolvers.Mutation.createPlace(null, { placeInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Unauthenticated."] })
      }
    })
    it("raises if no title, start, end", async () => {
      expect.assertions(2)
      const user = admin
      const context = { mongo, user }
      const placeInput = {}
      try {
        await resolvers.Mutation.createPlace(null, { placeInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({
          title: ["Missing title."],
          zipCode: ["Missing zip code."],
          city: ["Missing city."],
          country: ["Missing country."],
        })
      }
    })
  })
})
