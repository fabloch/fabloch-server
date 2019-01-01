import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { admin } from "../../../testUtils/fixtures"

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

  describe("createPlace", () => {
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
      expect.assertions(1)
      const user = null
      const context = { mongo, user }
      const placeInput = { title: "Awesome Place" }
      try {
        await resolvers.Mutation.createPlace(null, { placeInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated.")
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
        expect(e.message).toEqual("Failed to save place.")
        expect(e.validationErrors).toEqual({
          title: ["Title is missing."],
          zipCode: ["Zip Code is missing."],
          city: ["City is missing."],
          country: ["Country is missing."],
        })
      }
    })
  })
})
