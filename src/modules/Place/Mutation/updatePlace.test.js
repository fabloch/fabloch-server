import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, placeData, userData } from "../../../testUtils/fixtures"

let mongo

describe("Place Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("updatePlace", async () => {
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
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({
          title: ["Missing title."],
          street1: ["Missing street1."],
          zipCode: ["Missing zip code."],
          city: ["Missing city."],
          country: ["Missing country."],
          published: ["Missing published."],
          lat: ["Missing lat."],
          lng: ["Missing lng."],
        })
      }
    })
    it("raises an error if no user in context", async () => {
      expect.assertions(2)
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
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Unauthenticated."] })
      }
    })
    it("raises error if not admin", async () => {
      expect.assertions(2)
      const user = userData[0]
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
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Not allowed."] })
      }
    })
  })
})
