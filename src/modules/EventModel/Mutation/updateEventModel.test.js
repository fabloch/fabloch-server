import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, eventModelData, userData } from "../../../testUtils/fixtures"

let mongo

describe("updateEventModel", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("valid", async () => {
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
  })
  describe("invalid", async () => {
    it("raises an error if no id", async () => {
      expect.assertions(2)
      const user = userData[0]
      const context = { mongo, user }
      const eventModelInput = {}
      try {
        await resolvers.Mutation.updateEventModel(null, { eventModelInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["No id provided."] })
      }
    })
    it("raises an error if no user in context", async () => {
      expect.assertions(2)
      const user = null
      const context = { mongo, user }
      const eventModelInput = {
        id: eventModelData[0]._id.toString(),
        title: "Awesome EventModel",
      }
      try {
        await resolvers.Mutation.updateEventModel(null, { eventModelInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Unauthenticated."] })
      }
    })
    it("raises an error is user does not own eventModel", async () => {
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
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Not owner."] })
      }
    })
  })
})
