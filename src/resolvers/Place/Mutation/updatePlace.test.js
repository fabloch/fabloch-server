import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, placeData } from "../../../testUtils/fixtures"

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

  describe("updatePlace", () => {
    it("updates a place", async () => {
      await mongo.loadPlaces()
      const user = admin
      const context = { mongo, user }
      const placeInput = {
        id: placeData[0]._id.toString(),
        title: "title",
        street1: "street1",
        zipCode: "zipCode",
        city: "city",
        country: "france",
        published: true,
        lat: "1.1",
        lng: "1.1",
      }
      const response = await resolvers.Mutation.updatePlace(null, { placeInput }, context)
      expect(response.title).toEqual(placeInput.title)
    })
    it("deals with undefined or null", async () => {
      await mongo.loadPlaces()
      const user = admin
      const context = { mongo, user }
      const placeInput = {
        id: placeData[0]._id.toString(),
        title: "title",
        street1: "street1",
        zipCode: "zipCode",
        city: "city",
        country: "france",
        stateProvince: null,
        published: true,
        lat: "1.1",
        lng: "1.1",
      }
      const response = await resolvers.Mutation.updatePlace(null, { placeInput }, context)
      expect(response.title).toEqual(placeInput.title)
    })
    it("raises an error if no title, street1, zipCode, city, lat, lng", async () => {
      expect.assertions(2)
      const user = admin
      const context = { mongo, user }
      const placeInput = {
        id: placeData[0]._id.toString(),
      }
      try {
        await resolvers.Mutation.updatePlace(null, { placeInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to save place.")
        expect(e.validationErrors).toEqual({
          title: ["Title is missing."],
          street1: ["Street1 is missing."],
          zipCode: ["Zip Code is missing."],
          city: ["City is missing."],
          country: ["Country is missing."],
        })
      }
    })
    it("raises an error if no user in context", async () => {
      expect.assertions(1)
      const user = null
      const context = { mongo, user }
      const placeInput = {
        id: placeData[0]._id.toString(),
        title: "title",
        street1: "street1",
        zipCode: "zipCode",
        city: "city",
        country: "france",
        published: true,
        lat: "1.1",
        lng: "1.1",
      }
      try {
        await resolvers.Mutation.updatePlace(null, { placeInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated.")
      }
    })
  })
})
