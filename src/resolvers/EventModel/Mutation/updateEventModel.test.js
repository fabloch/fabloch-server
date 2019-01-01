import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import {
  admin,
  eventCatData,
  eventModelData,
  placeData,
  userData,
} from "../../../testUtils/fixtures"

let mongo

describe("updateEventModel", () => {
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
    it("returns with updated title, intro, description and seats", async () => {
      await mongo.loadEventModels()
      const user = userData[0]
      const context = { mongo, user }
      const eventModelInput = {
        id: eventModelData[0]._id.toString(),
        title: "Updated title",
        intro: "Updated intro",
        description: "Updated description",
        seat: "12345",
      }
      const response = await resolvers.Mutation.updateEventModel(null, { eventModelInput }, context)
      expect(response).toMatchObject({
        ...eventModelData[0],
        title: "Updated title",
        intro: "Updated intro",
        description: "Updated description",
        seat: "12345",
      })
    })
    it("stores updated title, intro, description and seats", async () => {
      await mongo.loadEventModels()
      const user = userData[0]
      const context = { mongo, user }
      const eventModelInput = {
        id: eventModelData[0]._id.toString(),
        title: "Updated title",
        intro: "Updated intro",
        description: "Updated description",
        seat: "12345",
      }
      await resolvers.Mutation.updateEventModel(null, { eventModelInput }, context)
      const eventModel = await mongo.EventModels.findOne({ _id: eventModelData[0]._id })
      expect(eventModel).toMatchObject({
        ...eventModelData[0],
        title: "Updated title",
        intro: "Updated intro",
        description: "Updated description",
        seat: "12345",
      })
    })
    it("updates any eventModel when user is admin", async () => {
      await mongo.loadEventModels()
      const user = admin
      const context = { mongo, user }
      const eventModelInput = {
        id: eventModelData[0]._id.toString(),
        title: "Updated title",
      }
      const response = await resolvers.Mutation.updateEventModel(null, { eventModelInput }, context)
      expect(response).toMatchObject({
        ...eventModelData[0],
        title: "Updated title",
      })
    })
    it("updates the place id", async () => {
      const user = userData[0]
      const context = { mongo, user }
      const eventModelInput = {
        id: eventModelData[0]._id.toString(),
        placeId: placeData[0]._id.toString(),
      }
      const response = await resolvers.Mutation.createEventModel(null, { eventModelInput }, context)
      expect(response).toMatchObject({
        id: eventModelData[0]._id.toString(),
        placeId: placeData[0]._id,
      })
    })
    it("updates the speaker id", async () => {
      const user = userData[0]
      const context = { mongo, user }
      const eventModelInput = {
        id: eventModelData[0]._id.toString(),
        speakerId: userData[1]._id.toString(),
      }
      const response = await resolvers.Mutation.createEventModel(null, { eventModelInput }, context)
      expect(response).toMatchObject({
        speakerId: userData[1]._id,
      })
    })
    it("updates the eventCats", async () => {
      await mongo.loadEventCats()
      await mongo.loadEventModels()
      const user = userData[0]
      const context = { mongo, user }
      const eventModelInput = {
        id: eventModelData[0]._id.toString(),
        eventCatIds: [eventCatData[2]._id.toString(), eventCatData[3]._id.toString()],
      }
      const response = await resolvers.Mutation.updateEventModel(null, { eventModelInput }, context)
      expect(response.eventCats).toMatchObject([
        { id: eventCatData[2]._id, name: eventCatData[2].name, color: eventCatData[2].color },
        { id: eventCatData[3]._id, name: eventCatData[3].name, color: eventCatData[3].color },
      ])
    })
  })
  describe("invalid", () => {
    it("raises an error if no user in context", async () => {
      expect.assertions(1)
      const user = null
      const context = { mongo, user }
      const eventModelInput = {
        id: eventModelData[0]._id.toString(),
        title: "Awesome EventModel",
      }
      try {
        await resolvers.Mutation.updateEventModel(null, { eventModelInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated.")
      }
    })
    it("raises an error is user does not own eventModel", async () => {
      expect.assertions(1)
      await mongo.loadEventModels()
      const user = userData[1]
      const context = { mongo, user }
      const eventModelInput = {
        id: eventModelData[0]._id.toString(),
        title: "Updated title",
      }
      try {
        await resolvers.Mutation.updateEventModel(null, { eventModelInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Not owner or admin.")
      }
    })
    it("raises an error if no id", async () => {
      expect.assertions(2)
      const user = userData[0]
      const context = { mongo, user }
      const eventModelInput = {}
      try {
        await resolvers.Mutation.updateEventModel(null, { eventModelInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to update event model.")
        expect(e.validationErrors).toEqual({ id: ["Id is missing."] })
      }
    })
  })
})
