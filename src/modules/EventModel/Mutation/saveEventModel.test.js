import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, eventModelData, userData } from "../../../testUtils/fixtures"

let mongo

describe("EventModel Mutation saveEventModel", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("create", async () => {
    it("creates an eventModel with the user as owner", async () => {
      const user = userData[0]
      const context = { mongo, user }
      const eventModelInput = {
        title: "Awesome EventModel",
        description: "This eventModel is awesome and this is its description.\nAnother line.",
        seats: 10,
        start: new Date("2018-09-16T08:30Z"),
        end: new Date("2018-09-16T13:00Z"),
      }
      const response = await resolvers.Mutation.saveEventModel(null, { eventModelInput }, context)
      expect(response).toMatchObject({
        title: "Awesome EventModel",
        description: "This eventModel is awesome and this is its description.\nAnother line.",
        ownerId: user._id,
        seats: 10,
        start: new Date("2018-09-16T08:30Z"),
        end: new Date("2018-09-16T13:00Z"),
      })
    })
  })
  describe("update", async () => {
    it("updates an eventModel when user is owner", async () => {
      await mongo.loadEventModels()
      const user = userData[0]
      const context = { mongo, user }
      const eventModelInput = {
        id: eventModelData[0]._id.toString(),
        title: "Updated title",
      }
      const response = await resolvers.Mutation.saveEventModel(null, { eventModelInput }, context)
      expect(response).toMatchObject({
        ...eventModelData[0],
        title: "Updated title",
      })
    })
    it("updates an eventModel when user is admin", async () => {
      await mongo.loadEventModels()
      const user = admin
      const context = { mongo, user }
      const eventModelInput = {
        id: eventModelData[0]._id.toString(),
        title: "Updated title",
      }
      const response = await resolvers.Mutation.saveEventModel(null, { eventModelInput }, context)
      expect(response).toMatchObject({
        ...eventModelData[0],
        title: "Updated title",
      })
    })
  })
  describe("errors", async () => {
    it("raises an error if no user in context", async () => {
      expect.assertions(2)
      const user = null
      const context = { mongo, user }
      const eventModelInput = { title: "Awesome EventModel" }
      try {
        await resolvers.Mutation.saveEventModel(null, { eventModelInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Unauthenticated."] })
      }
    })
    describe("create", () => {
      it("raises an error if start < now", async () => {
        expect.assertions(2)
        const user = userData[0]
        const context = { mongo, user }
        const eventModelInput = {
          start: new Date("2015-09-16T13:00Z"),
          end: new Date("2018-09-16T08:30Z"),
        }
        try {
          await resolvers.Mutation.saveEventModel(null, { eventModelInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({
            start: ["Start date is in the past."],
          })
        }
      })
      it("raises an error if start < end", async () => {
        expect.assertions(2)
        const user = userData[0]
        const context = { mongo, user }
        const eventModelInput = {
          start: new Date("2018-09-16T13:00Z"),
          end: new Date("2018-09-16T08:30Z"),
        }
        try {
          await resolvers.Mutation.saveEventModel(null, { eventModelInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ start: ["Start date is after end date."] })
        }
      })
    })
    describe("update", () => {
      it("raises an error if start < now", async () => {
        expect.assertions(2)
        await mongo.loadEventModels()
        const user = userData[0]
        const context = { mongo, user }
        const eventModelInput = {
          id: eventModelData[0]._id.toString(),
          start: new Date("2015-09-16T13:00Z"),
          end: new Date("2018-09-16T08:30Z"),
        }
        try {
          await resolvers.Mutation.saveEventModel(null, { eventModelInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({
            start: ["Start date is in the past."],
          })
        }
      })
      it("raises an error if start < end", async () => {
        expect.assertions(2)
        await mongo.loadEventModels()
        const user = userData[0]
        const context = { mongo, user }
        const eventModelInput = {
          id: eventModelData[0]._id.toString(),
          start: new Date("2018-09-16T13:00Z"),
          end: new Date("2018-09-16T08:30Z"),
        }
        try {
          await resolvers.Mutation.saveEventModel(null, { eventModelInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ start: ["Start date is after end date."] })
        }
      })
    })
  })
})
