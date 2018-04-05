import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventCatData, eventModelData, placeData, userData } from "../../../testUtils/fixtures"

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
        titleSuper: "A title",
        introSuper: "Introduction",
        descriptionSuper: "A description",
        seatsSuper: 10,
      }
      const response = await resolvers.Mutation
        .createEventSession(null, { eventSessionInput }, context)
      expect(response).toMatchObject({
        eventModelId: eventModelData[0]._id,
        ownerId: user._id,
        titleSuper: "A title",
        introSuper: "Introduction",
        descriptionSuper: "A description",
        seatsSuper: 10,
      })
    })
    it("stores title, description, seats", async () => {
      await mongo.loadEventModels()
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        eventModelId: eventModelData[0]._id.toString(),
        titleSuper: "A title",
        introSuper: "Introduction",
        descriptionSuper: "A description",
        seatsSuper: 10,
      }
      const response = await resolvers.Mutation
        .createEventSession(null, { eventSessionInput }, context)
      const eventSession = await mongo.EventSessions.findOne({ _id: response._id })
      expect(eventSession).toMatchObject({
        eventModelId: eventModelData[0]._id,
        ownerId: user._id,
        titleSuper: "A title",
        introSuper: "Introduction",
        descriptionSuper: "A description",
        seatsSuper: 10,
      })
    })
    it("links the super place id", async () => {
      await mongo.loadEventModels()
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        eventModelId: eventModelData[0]._id.toString(),
        placeSuperId: placeData[0]._id.toString(),
      }
      const response = await resolvers.Mutation
        .createEventSession(null, { eventSessionInput }, context)
      expect(response).toMatchObject({
        placeSuperId: placeData[0]._id,
      })
    })
    it("links the super speaker id", async () => {
      await mongo.loadEventModels()
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        eventModelId: eventModelData[0]._id.toString(),
        speakerSuperId: userData[0]._id.toString(),
      }
      const response = await resolvers.Mutation
        .createEventSession(null, { eventSessionInput }, context)
      expect(response).toMatchObject({
        speakerSuperId: userData[0]._id,
      })
    })
    it("links the super eventCats", async () => {
      await mongo.loadEventModels()
      await mongo.loadEventCats()
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        eventModelId: eventModelData[0]._id.toString(),
        eventCatSuperIds: [
          eventCatData[0]._id.toString(),
          eventCatData[1]._id.toString(),
        ],
      }
      const response = await resolvers.Mutation
        .createEventSession(null, { eventSessionInput }, context)
      expect(response.eventCatsSuper).toMatchObject([
        { id: eventCatData[0]._id, name: eventCatData[0].name, color: eventCatData[0].color },
        { id: eventCatData[1]._id, name: eventCatData[1].name, color: eventCatData[1].color },
      ])
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
    it("raises error if trying to store title, intro, description, seats, placeId, eventCats", async () => {
      await mongo.loadEventModels()
      const user = userData[0]
      const context = { mongo, user }
      const eventSessionInput = {
        eventModelId: eventModelData[0]._id.toString(),
        title: "A title",
        intro: "Something",
        description: "Something",
        seats: "Something",
        placeId: "Something",
        eventCats: "Something",
      }
      try {
        await resolvers.Mutation.createEventSession(null, { eventSessionInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({
          description: ["Forbidden field: description."],
          eventCats: ["Forbidden field: event cats."],
          intro: ["Forbidden field: intro."],
          placeId: ["Forbidden field: place id."],
          seats: ["Forbidden field: seats."],
          title: ["Forbidden field: title."],
        })
      }
    })
    it("raises error if seats is not a number")
    it("raises error if placeID is not an objectId")
  })
})
