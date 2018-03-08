import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventModelData, placeData, userData } from "../../../testUtils/fixtures"

let mongo

describe("createEventSession", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("valid", async () => {
    it("links the context user as owner", async () => {
      await mongo.loadEventModels()
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        eventModelId: eventModelData[0]._id.toString(),
      }
      const response = await resolvers.Mutation
        .createEventSession(null, { eventSessionInput }, context)
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
      const response = await resolvers.Mutation
        .createEventSession(null, { eventSessionInput }, context)
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
        seat: 10,
      }
      const response = await resolvers.Mutation
        .createEventSession(null, { eventSessionInput }, context)
      expect(response).toMatchObject({
        eventModelId: eventModelData[0]._id,
        ownerId: user._id,
        title: "A title",
        intro: "Introduction",
        description: "A description",
        seat: 10,
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
        seat: 10,
      }
      const response = await resolvers.Mutation
        .createEventSession(null, { eventSessionInput }, context)
      const eventSession = await mongo.EventSessions.findOne({ _id: response._id })
      expect(eventSession).toMatchObject({
        eventModelId: eventModelData[0]._id,
        ownerId: user._id,
        title: "A title",
        intro: "Introduction",
        description: "A description",
        seat: 10,
      })
    })
    it("links the place id", async () => {
      await mongo.loadEventModels()
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        eventModelId: eventModelData[0]._id.toString(),
        placeId: placeData[0]._id.toString(),
      }
      const response = await resolvers.Mutation
        .createEventSession(null, { eventSessionInput }, context)
      expect(response).toMatchObject({
        placeId: placeData[0]._id,
      })
    })
  })
  describe("invalid", async () => {
    it("raises error if no user in context", async () => {
      expect.assertions(2)
      const user = null
      const context = { mongo, user }
      const eventSessionInput = { title: "Awesome EventSession" }
      try {
        await resolvers.Mutation.createEventSession(null, { eventSessionInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Unauthenticated."] })
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
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({
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
        start: new Date("2018-09-16T13:00Z"),
        end: new Date("2018-09-16T08:30Z"),
      }
      try {
        await resolvers.Mutation.createEventSession(null, { eventSessionInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ start: ["Start date is after end date."] })
      }
    })
    it("raises error if no eventModelId", async () => {
      await mongo.loadEventModels()
      expect.assertions(2)
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
      }
      try {
        await resolvers.Mutation.createEventSession(null, { eventSessionInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["eventModelId missing."] })
      }
    })
    it("raises error if no eventModel", async () => {
      expect.assertions(2)
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        eventModelId: eventModelData[0]._id.toString(),
        start: new Date("2018-09-16T13:00Z"),
        end: new Date("2018-09-16T08:30Z"),
      }
      try {
        await resolvers.Mutation.createEventSession(null, { eventSessionInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Parent eventModel does not exist."] })
      }
    })
    it("raises error if seat is not a number")
    it("raises error if placeID is not an objectId")
  })
})
