import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, eventData, userData } from "../../../testUtils/fixtures"

let mongo

describe("Event Mutation saveEvent", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("create", async () => {
    it("creates an event with the user as owner", async () => {
      const user = userData[0]
      const context = { mongo, user }
      const eventInput = {
        title: "Awesome Event",
        description: "This event is awesome and this is its description.\nAnother line.",
        seats: 10,
        start: new Date("2018-09-16T08:30Z"),
        end: new Date("2018-09-16T13:00Z"),
      }
      const response = await resolvers.Mutation.saveEvent(null, { eventInput }, context)
      expect(response).toMatchObject({
        title: "Awesome Event",
        description: "This event is awesome and this is its description.\nAnother line.",
        ownerId: user._id,
        seats: 10,
        start: new Date("2018-09-16T08:30Z"),
        end: new Date("2018-09-16T13:00Z"),
      })
    })
  })
  describe("update", async () => {
    it("updates an event when user is owner", async () => {
      await mongo.loadEvents()
      const user = userData[0]
      const context = { mongo, user }
      const eventInput = {
        id: eventData[0]._id.toString(),
        title: "Updated title",
      }
      const response = await resolvers.Mutation.saveEvent(null, { eventInput }, context)
      expect(response).toMatchObject({
        ...eventData[0],
        title: "Updated title",
      })
    })
    it("updates an event when user is admin", async () => {
      await mongo.loadEvents()
      const user = admin
      const context = { mongo, user }
      const eventInput = {
        id: eventData[0]._id.toString(),
        title: "Updated title",
      }
      const response = await resolvers.Mutation.saveEvent(null, { eventInput }, context)
      expect(response).toMatchObject({
        ...eventData[0],
        title: "Updated title",
      })
    })
  })
  describe("errors", async () => {
    it("raises an error if no user in context", async () => {
      expect.assertions(2)
      const user = null
      const context = { mongo, user }
      const eventInput = { title: "Awesome Event" }
      try {
        await resolvers.Mutation.saveEvent(null, { eventInput }, context)
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
        const eventInput = {
          start: new Date("2015-09-16T13:00Z"),
          end: new Date("2018-09-16T08:30Z"),
        }
        try {
          await resolvers.Mutation.saveEvent(null, { eventInput }, context)
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
        const eventInput = {
          start: new Date("2018-09-16T13:00Z"),
          end: new Date("2018-09-16T08:30Z"),
        }
        try {
          await resolvers.Mutation.saveEvent(null, { eventInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ start: ["Start date is after end date."] })
        }
      })
    })
    describe("update", () => {
      it("raises an error if start < now", async () => {
        expect.assertions(2)
        await mongo.loadEvents()
        const user = userData[0]
        const context = { mongo, user }
        const eventInput = {
          id: eventData[0]._id.toString(),
          start: new Date("2015-09-16T13:00Z"),
          end: new Date("2018-09-16T08:30Z"),
        }
        try {
          await resolvers.Mutation.saveEvent(null, { eventInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({
            start: ["Start date is in the past."],
          })
        }
      })
      it("raises an error if start < end", async () => {
        expect.assertions(2)
        await mongo.loadEvents()
        const user = userData[0]
        const context = { mongo, user }
        const eventInput = {
          id: eventData[0]._id.toString(),
          start: new Date("2018-09-16T13:00Z"),
          end: new Date("2018-09-16T08:30Z"),
        }
        try {
          await resolvers.Mutation.saveEvent(null, { eventInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ start: ["Start date is after end date."] })
        }
      })
    })
  })
})
