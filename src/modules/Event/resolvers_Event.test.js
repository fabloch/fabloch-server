import resolvers from "./resolvers"
import connectMongo from "../../testUtils/mongoTest"
import { eventData, eventTicketData, userData } from "../../testUtils/fixtures"

let mongo

describe("Event Event resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

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
