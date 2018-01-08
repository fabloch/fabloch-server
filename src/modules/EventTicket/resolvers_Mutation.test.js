import { ObjectId } from "mongodb"
import resolvers from "./resolvers"
import connectMongo from "../../testUtils/mongoTest"
import { eventData, userData } from "../../testUtils/fixtures"

let mongo

describe("EventTicket Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("createEventTicket", () => {
    it("creates eventTicket", async () => {
      await mongo.loadUsers()
      await mongo.loadEvents()
      const user = await mongo.Users.findOne({ email: "user1@example.com" })
      const context = { mongo, user }
      const eventTicket = {
        eventId: "5a4a5eb6404da6d636078beb",
      }
      const response = await resolvers.Mutation.createEventTicket(null, { eventTicket }, context)
      expect(response).toMatchObject({
        eventId: ObjectId("5a4a5eb6404da6d636078beb"),
        participantId: ObjectId("5a31b456c5e7b54a9aba3782"),
      })
    })
    it("raises error if no event", async () => {
      await mongo.loadUsers()
      const user = await mongo.Users.findOne({ email: "user1@example.com" })
      const context = { mongo, user }
      const eventTicket = {
        eventId: "5a4a5eb6404da6d636078beb",
      }
      expect.assertions(1)
      try {
        await resolvers.Mutation.createEventTicket(null, { eventTicket }, context)
      } catch (e) {
        expect(e.message).toEqual("Event does not exist.")
      }
    })
    it("raises error if no more seats", async () => {
      await mongo.loadUsers()
      await mongo.loadEvents()
      await mongo.loadEventTickets()
      const user = await mongo.Users.findOne({ email: "user1@example.com" })
      const context = { mongo, user }
      const eventTicket = {
        eventId: "5a4a5eb6404da6d636078beb",
      }
      expect.assertions(1)
      try {
        await resolvers.Mutation.createEventTicket(null, { eventTicket }, context)
      } catch (e) {
        expect(e.message).toEqual("No more seats for that event.")
      }
    })
    it("raises error if already an eventTicket for user and event", async () => {
      await mongo.loadUsers()
      await mongo.loadEvents()
      const user = await mongo.Users.findOne({ email: "user1@example.com" })
      const context = { mongo, user }
      const eventTicket = {
        eventId: "5a4a5eb6404da6d636078beb",
      }
      await resolvers.Mutation.createEventTicket(null, { eventTicket }, context)
      expect.assertions(1)
      try {
        await resolvers.Mutation.createEventTicket(null, { eventTicket }, context)
      } catch (e) {
        expect(e.message).toEqual("User already has a ticket for that event.")
      }
    })
    // it("doesn't create eventTicket if now > end")
    // it("doesn't create eventTicket if event.pris and no eventTicket.payment")
  })
})
