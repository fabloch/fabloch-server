import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { eventCatData, eventModelData, placeData, userData } from "../../../testUtils/fixtures"

let mongo

describe("createEventSession", () => {
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
      await mongo.loadEventModels()
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        eventModelId: eventModelData[0]._id.toString(),
      }
      const response = await resolvers.Mutation.createEventSession(
        null,
        { eventSessionInput },
        context,
      )
      expect(response).toMatchObject({
        ownerId: user._id,
      })
    })
    it("links the eventModel", async () => {
      await mongo.loadEventModels()
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        eventModelId: eventModelData[0]._id.toString(),
      }
      const response = await resolvers.Mutation.createEventSession(
        null,
        { eventSessionInput },
        context,
      )
      expect(response).toMatchObject({
        eventModelId: eventModelData[0]._id,
      })
    })
    it("returns title, intro, description, seats", async () => {
      await mongo.loadEventModels()
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        eventModelId: eventModelData[0]._id.toString(),
        title: "A title",
        intro: "Introduction",
        description: "A description",
        seats: 10,
      }
      const response = await resolvers.Mutation.createEventSession(
        null,
        { eventSessionInput },
        context,
      )
      expect(response).toMatchObject({
        eventModelId: eventModelData[0]._id,
        ownerId: user._id,
        title: "A title",
        intro: "Introduction",
        description: "A description",
        seats: 10,
      })
    })
    it("stores title, description, seats", async () => {
      await mongo.loadEventModels()
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        eventModelId: eventModelData[0]._id.toString(),
        title: "A title",
        intro: "Introduction",
        description: "A description",
        seats: 10,
      }
      const response = await resolvers.Mutation.createEventSession(
        null,
        { eventSessionInput },
        context,
      )
      const eventSession = await mongo.EventSessions.findOne({ _id: response._id })
      expect(eventSession).toMatchObject({
        eventModelId: eventModelData[0]._id,
        ownerId: user._id,
        title: "A title",
        intro: "Introduction",
        description: "A description",
        seats: 10,
      })
    })
    it("links the super place id", async () => {
      await mongo.loadEventModels()
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        eventModelId: eventModelData[0]._id.toString(),
        placeId: placeData[0]._id.toString(),
      }
      const response = await resolvers.Mutation.createEventSession(
        null,
        { eventSessionInput },
        context,
      )
      expect(response).toMatchObject({
        placeId: placeData[0]._id,
      })
    })
    it("links the super speaker id", async () => {
      await mongo.loadEventModels()
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        eventModelId: eventModelData[0]._id.toString(),
        speakerId: userData[0]._id.toString(),
      }
      const response = await resolvers.Mutation.createEventSession(
        null,
        { eventSessionInput },
        context,
      )
      expect(response).toMatchObject({
        speakerId: userData[0]._id,
      })
    })
    it("links the super eventCats", async () => {
      await mongo.loadEventModels()
      await mongo.loadEventCats()
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        eventModelId: eventModelData[0]._id.toString(),
        eventCatIds: [eventCatData[0]._id.toString(), eventCatData[1]._id.toString()],
      }
      const response = await resolvers.Mutation.createEventSession(
        null,
        { eventSessionInput },
        context,
      )
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
      const eventSessionInput = { title: "Awesome EventSession" }
      try {
        await resolvers.Mutation.createEventSession(null, { eventSessionInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated.")
      }
    })
    it("raises an error if start < now", async () => {
      await mongo.loadEventModels()
      expect.assertions(2)
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        eventModelId: eventModelData[0]._id.toString(),
        start: new Date("2015-09-16T13:00Z"),
        end: new Date("2018-09-16T08:30Z"),
      }
      try {
        await resolvers.Mutation.createEventSession(null, { eventSessionInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to create event session.")
        expect(e.validationErrors).toEqual({
          start: ["Start date is in the past."],
        })
      }
    })
    it("raises an error if start < end", async () => {
      await mongo.loadEventModels()
      expect.assertions(2)
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        eventModelId: eventModelData[0]._id.toString(),
        start: new Date("2050-09-16T13:00Z"),
        end: new Date("2050-09-16T08:30Z"),
      }
      try {
        await resolvers.Mutation.createEventSession(null, { eventSessionInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to create event session.")
        expect(e.validationErrors).toEqual({ start: ["Start date is after end date."] })
      }
    })
    it("raises error if no eventModelId", async () => {
      await mongo.loadEventModels()
      expect.assertions(2)
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {}
      try {
        await resolvers.Mutation.createEventSession(null, { eventSessionInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to create event session.")
        expect(e.validationErrors).toEqual({ eventModelId: ["Event Modelid is missing."] })
      }
    })
    it("raises error if no eventModel", async () => {
      expect.assertions(1)
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        eventModelId: eventModelData[0]._id.toString(),
        start: new Date("2050-09-16T13:00Z"),
        end: new Date("2050-09-16T16:30Z"),
      }
      try {
        await resolvers.Mutation.createEventSession(null, { eventSessionInput }, context)
      } catch (e) {
        expect(e.message).toMatch("No event model found with id")
      }
    })
    it("raises error if seats is not a number", () => {})
    it("raises error if placeID is not an objectId", () => {})
  })
})
