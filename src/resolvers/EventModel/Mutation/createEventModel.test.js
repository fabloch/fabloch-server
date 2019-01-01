import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, eventCatData, placeData, userData } from "../../../testUtils/fixtures"

let mongo

describe("createEventModel", () => {
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

  describe("valid", () => {
    it("links the context user as owner", async () => {
      const user = admin
      const context = { mongo, user }
      const eventModelInput = {}
      const response = await resolvers.Mutation.createEventModel(null, { eventModelInput }, context)
      expect(response).toMatchObject({
        ownerId: user._id,
      })
    })
    it("returns title, intro, description, seats", async () => {
      const user = userData[0]
      const context = { mongo, user }
      const eventModelInput = {
        title: "A title",
        intro: "An intro",
        description: "A description",
        seat: 10,
      }
      const response = await resolvers.Mutation.createEventModel(null, { eventModelInput }, context)
      expect(response).toMatchObject({
        ownerId: user._id,
        title: "A title",
        intro: "An intro",
        description: "A description",
        seat: 10,
      })
    })
    it("stores title, description, seats", async () => {
      const user = userData[0]
      const context = { mongo, user }
      const eventModelInput = {
        title: "A title",
        intro: "An intro",
        description: "A description",
        seat: 10,
      }
      const response = await resolvers.Mutation.createEventModel(null, { eventModelInput }, context)
      const eventModel = await mongo.EventModels.findOne({ _id: response._id })
      expect(eventModel).toMatchObject({
        ownerId: user._id,
        title: "A title",
        intro: "An intro",
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
        placeId: placeData[0]._id,
      })
    })
    it("links the speaker id", async () => {
      const user = userData[0]
      const context = { mongo, user }
      const eventModelInput = {
        speakerId: userData[1]._id.toString(),
      }
      const response = await resolvers.Mutation.createEventModel(null, { eventModelInput }, context)
      expect(response).toMatchObject({
        speakerId: userData[1]._id,
      })
    })
    it("links the eventCats", async () => {
      await mongo.loadEventCats()
      const user = userData[0]
      const context = { mongo, user }
      const eventModelInput = {
        eventCatIds: [eventCatData[0]._id.toString(), eventCatData[1]._id.toString()],
      }
      const response = await resolvers.Mutation.createEventModel(null, { eventModelInput }, context)
      expect(response.eventCats).toMatchObject([
        { id: eventCatData[0]._id, name: eventCatData[0].name, color: eventCatData[0].color },
        { id: eventCatData[1]._id, name: eventCatData[1].name, color: eventCatData[1].color },
      ])
    })
  })
  describe("invalid", () => {
    it("raises error if no user in context", async () => {
      expect.assertions(1)
      const user = null
      const context = { mongo, user }
      const eventModelInput = { title: "Awesome EventModel" }
      try {
        await resolvers.Mutation.createEventModel(null, { eventModelInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated.")
      }
    })
    xit("raises error if seat is not a number", () => {})
    xit("raises error if placeID is not an objectId", () => {})
  })
})
