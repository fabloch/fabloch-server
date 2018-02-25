import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventData, eventTicketData, userData } from "../../../testUtils/fixtures"

let mongo

describe("Event Event resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("bookings", () => {
    it("returns the number of tickets for the event", async () => {
      await mongo.loadEventTickets()
      const context = { mongo }
      const response = await resolvers.Event.bookings(eventData[0], null, context)
      expect(response).toEqual(2)
    })
    it("returns 0 if no bookings", async () => {
      await mongo.loadEventTickets()
      const context = { mongo }
      const response = await resolvers.Event.bookings(eventData[1], null, context)
      expect(response).toEqual(0)
    })
  })
  describe("tickets", () => {
    it("returns the eventTickets for that event", async () => {
      await mongo.loadEventTickets()
      const context = { mongo }
      const response = await resolvers.Event.tickets(eventData[0], null, context)
      expect(response).toEqual(eventTicketData)
    })
  })
})
