import { ObjectId } from "mongodb"
import resolvers from "./resolvers"
import connectMongo from "../../testUtils/mongoTest"
import { eventData, eventTicketData, userData } from "../../testUtils/fixtures"

let mongo

describe("Event Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("createEvent", () => {
    it("creates an event with the user as owner", async () => {
      await mongo.loadUsers()
      const user = await mongo.Users.findOne({ email: "user1@example.com" })
      const context = { mongo, user }
      const event = {
        title: "Awesome Event",
        description: "This event is awesome and this is its description",
        seats: 10,
        start: "2018-09-16T08:30Z",
        end: "2018-09-16T13:00Z",
      }
      const response = await resolvers.Mutation.createEvent(null, { event }, context)
      expect(response).toMatchObject({
        title: "Awesome Event",
        description: "This event is awesome and this is its description",
        ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
        seats: 10,
        start: "2018-09-16T08:30Z",
        end: "2018-09-16T13:00Z",
      })
    })
    it("raises an error if no user in context", async () => {
      const user = null
      const context = { mongo, user }
      const event = { title: "Awesome Event" }
      expect.assertions(1)
      try {
        await resolvers.Mutation.createEvent(null, { event }, context)
      } catch (e) {
        expect(e.message).toMatch("Unauthenticated.")
      }
    })
    it("raises an error if start < now", async () => {
      expect.assertions(1)
      await mongo.loadUsers()
      const user = await mongo.Users.findOne({ email: "user1@example.com" })
      const context = { mongo, user }
      const event = {
        title: "Awesome Event",
        description: "This event is awesome and this is its description",
        seats: 10,
        start: "2015-09-16T13:00Z",
        end: "2018-09-16T08:30Z",
      }
      try {
        await resolvers.Mutation.createEvent(null, { event }, context)
      } catch (e) {
        expect(e.message).toEqual("Start date is in the past.")
      }
    })
    it("raises an error if start < end", async () => {
      expect.assertions(1)
      await mongo.loadUsers()
      const user = await mongo.Users.findOne({ email: "user1@example.com" })
      const context = { mongo, user }
      const event = {
        title: "Awesome Event",
        description: "This event is awesome and this is its description",
        seats: 10,
        start: "2018-09-16T13:00Z",
        end: "2018-09-16T08:30Z",
      }
      try {
        await resolvers.Mutation.createEvent(null, { event }, context)
      } catch (e) {
        expect(e.message).toEqual("Start date is after end date.")
      }
    })
  })
})
describe("Event", () => {
  describe("id", () => {
    it("returns _id from db", () => {
      expect(resolvers.Event.id(eventData[0])).toEqual("5a4a5eb6404da6d636078beb")
    })
  })
  describe("owner", () => {
    it("returns user", async () => {
      await mongo.loadUsers()
      const context = { mongo }
      const response = await resolvers.Event.owner(eventData[0], null, context)
      expect(response).toEqual(userData[0])
    })
  })
  describe("bookings", () => {
    it("returns the number of tickets for the event", async () => {
      await mongo.loadEventTickets()
      const context = { mongo }
      const response = await resolvers.Event.bookings(eventData[0], null, context)
      expect(response).toEqual(2)
    })
  })
  describe("tickets", () => {
    it("returns the eventTickets for the event", async () => {
      await mongo.loadEventTickets()
      const context = { mongo }
      const response = await resolvers.Event.tickets(eventData[0], null, context)
      expect(response).toEqual(eventTicketData)
    })
  })
})
