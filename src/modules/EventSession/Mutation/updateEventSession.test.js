import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import {
  admin,
  eventCatData,
  eventModelData,
  eventSessionData,
  placeData,
  userData,
} from "../../../testUtils/fixtures"

let mongo

describe("updateEventSession", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("valid", async () => {
    it("returns with updated title, intro, description and seats", async () => {
      await mongo.loadEventSessions()
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        id: eventSessionData[0]._id.toString(),
        title: "Updated title",
        intro: "Updated introduction",
        description: "Updated description",
        seats: "12345",
      }
      const response = await resolvers.Mutation
        .updateEventSession(null, { eventSessionInput }, context)
      expect(response).toMatchObject({
        ...eventSessionData[0],
        title: "Updated title",
        intro: "Updated introduction",
        description: "Updated description",
        seats: "12345",
      })
    })
    it("stores updated title, description and seats", async () => {
      await mongo.loadEventSessions()
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        id: eventSessionData[0]._id.toString(),
        title: "Updated title",
        intro: "Updated introduction",
        description: "Updated description",
        seats: "12345",
      }
      await resolvers.Mutation.updateEventSession(null, { eventSessionInput }, context)
      const eventSession = await mongo.EventSessions.findOne({ _id: eventSessionData[0]._id })
      expect(eventSession).toMatchObject({
        ...eventSessionData[0],
        title: "Updated title",
        intro: "Updated introduction",
        description: "Updated description",
        seats: "12345",
      })
    })
    it("updates any eventSession when user is admin", async () => {
      await mongo.loadEventSessions()
      const user = admin
      const context = { mongo, user }
      const eventSessionInput = {
        id: eventSessionData[0]._id.toString(),
        title: "Updated title",
      }
      const response = await resolvers.Mutation
        .updateEventSession(null, { eventSessionInput }, context)
      expect(response).toMatchObject({
        ...eventSessionData[0],
        title: "Updated title",
      })
    })
    it("updates start and end", async () => {
      await mongo.loadEventSessions()
      const user = admin
      const context = { mongo, user }
      const eventSessionInput = {
        id: eventSessionData[0]._id.toString(),
        start: new Date("2022-09-16T13:00Z"),
        end: new Date("2022-09-16T13:30Z"),
      }
      const response = await resolvers.Mutation
        .updateEventSession(null, { eventSessionInput }, context)
      expect(response).toMatchObject({
        ...eventSessionData[0],
        start: new Date("2022-09-16T13:00Z"),
        end: new Date("2022-09-16T13:30Z"),
      })
    })
    it("updates eventModel", async () => {
      await mongo.loadEventModels()
      await mongo.loadEventSessions()
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        id: eventSessionData[0]._id.toString(),
        eventModelId: eventModelData[1]._id.toString(),
      }
      const response = await resolvers.Mutation
        .updateEventSession(null, { eventSessionInput }, context)
      expect(response).toMatchObject({
        ...eventSessionData[0],
        eventModelId: eventModelData[1]._id,
      })
    })
    it("updates place", async () => {
      await mongo.loadEventSessions()
      await mongo.loadPlaces()
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        id: eventSessionData[0]._id.toString(),
        placeId: placeData[1]._id.toString(),
      }
      const response = await resolvers.Mutation
        .updateEventSession(null, { eventSessionInput }, context)
      expect(response).toMatchObject({
        ...eventSessionData[0],
        placeId: placeData[1]._id,
      })
    })
    it("updates the eventCats", async () => {
      await mongo.loadEventCats()
      await mongo.loadEventSessions()
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        id: eventSessionData[0]._id.toString(),
        eventCatIds: [
          eventCatData[2]._id.toString(),
          eventCatData[3]._id.toString(),
        ],
      }
      const response = await resolvers.Mutation
        .updateEventSession(null, { eventSessionInput }, context)
      expect(response.eventCats).toMatchObject([
        { id: eventCatData[2]._id, name: eventCatData[2].name, color: eventCatData[2].color },
        { id: eventCatData[3]._id, name: eventCatData[3].name, color: eventCatData[3].color },
      ])
    })
    it("updates owner", async () => {
      await mongo.loadUsers()
      await mongo.loadEventSessions()
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        id: eventSessionData[0]._id.toString(),
        ownerId: userData[1]._id.toString(),
      }
      const response = await resolvers.Mutation
        .updateEventSession(null, { eventSessionInput }, context)
      expect(response).toMatchObject({
        ...eventSessionData[0],
        ownerId: userData[1]._id,
      })
    })
  })
  describe("invalid", async () => {
    it("raises an error if no id", async () => {
      expect.assertions(2)
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {}
      try {
        await resolvers.Mutation.updateEventSession(null, { eventSessionInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["No id provided."] })
      }
    })
    it("raises an error if no user in context", async () => {
      expect.assertions(2)
      const user = null
      const context = { mongo, user }
      const eventSessionInput = {
        id: eventSessionData[0]._id.toString(),
        title: "Awesome EventSession",
      }
      try {
        await resolvers.Mutation.updateEventSession(null, { eventSessionInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Unauthenticated."] })
      }
    })
    it("raises an error is user does not own eventSession", async () => {
      await mongo.loadEventSessions()
      const user = userData[1]
      const context = { mongo, user }
      const eventSessionInput = {
        id: eventSessionData[0]._id.toString(),
        title: "Updated title",
      }
      try {
        await resolvers.Mutation.updateEventSession(null, { eventSessionInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Not owner."] })
      }
    })
    it("raises an error if start < now", async () => {
      await mongo.loadEventSessions()
      expect.assertions(2)
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        id: eventSessionData[0]._id.toString(),
        start: new Date("2015-09-16T13:00Z"),
        end: new Date("2022-09-16T08:30Z"),
      }
      try {
        await resolvers.Mutation.updateEventSession(null, { eventSessionInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({
          start: ["Start date is in the past."],
        })
      }
    })
    it("raises an error if start < end", async () => {
      await mongo.loadEventSessions()
      expect.assertions(2)
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        id: eventSessionData[0]._id.toString(),
        start: new Date("2022-09-16T13:00Z"),
        end: new Date("2022-09-16T08:30Z"),
      }
      try {
        await resolvers.Mutation.updateEventSession(null, { eventSessionInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ start: ["Start date is after end date."] })
      }
    })
    it("raises error if invalid ownerId")
    it("raises error if invalid eventModelId")
    it("raises error if invalid placeId")
  })
})
