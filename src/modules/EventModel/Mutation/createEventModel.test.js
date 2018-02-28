import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { placeData, userData } from "../../../testUtils/fixtures"

let mongo

describe("createEventModel", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("valid", async () => {
    it("links the context user as owner", async () => {
      const user = userData[0]
      const context = { mongo, user }
      const eventModelInput = {}
      const response = await resolvers.Mutation.createEventModel(null, { eventModelInput }, context)
      expect(response).toMatchObject({
        ownerId: user._id,
      })
    })
    it("returns title, description, seats", async () => {
      const user = userData[0]
      const context = { mongo, user }
      const eventModelInput = {
        title: "A title",
        description: "A description",
        seat: 10,
      }
      const response = await resolvers.Mutation.createEventModel(null, { eventModelInput }, context)
      expect(response).toMatchObject({
        ownerId: user._id,
        title: "A title",
        description: "A description",
        seat: 10,
      })
    })
    it("stores title, description, seats", async () => {
      const user = userData[0]
      const context = { mongo, user }
      const eventModelInput = {
        title: "A title",
        description: "A description",
        seat: 10,
      }
      const response = await resolvers.Mutation.createEventModel(null, { eventModelInput }, context)
      const eventModel = await mongo.EventModels.findOne({ _id: response._id })
      expect(eventModel).toMatchObject({
        ownerId: user._id,
        title: "A title",
        description: "A description",
        seat: 10,
      })
    })
    it("links the place id", async () => {
      const user = userData[0]
      const context = { mongo, user }
      const eventModelInput = {
        placeId: placeData[0]._id.toString(),
      }
      const response = await resolvers.Mutation.createEventModel(null, { eventModelInput }, context)
      expect(response).toMatchObject({
        placeId: placeData[0]._id.toString(),
      })
    })
  })
  describe("invalid", async () => {
    it("raises error if no user in context", async () => {
      expect.assertions(2)
      const user = null
      const context = { mongo, user }
      const eventModelInput = { title: "Awesome EventModel" }
      try {
        await resolvers.Mutation.createEventModel(null, { eventModelInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Unauthenticated."] })
      }
    })
    it("raises error if seat is not a number")
    it("raises error if placeID is not an objectId")
  })
})
