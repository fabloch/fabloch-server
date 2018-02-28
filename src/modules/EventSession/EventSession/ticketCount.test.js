import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventSessionData, eventTicketData, userData } from "../../../testUtils/fixtures"

let mongo

describe("EventSession EventSession resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("ticketCount", () => {
    it("returns the number of tickets for the eventSession", async () => {
      await mongo.loadEventTickets()
      const context = { mongo }
      const response = await resolvers.EventSession.ticketCount(eventSessionData[0], null, context)
      expect(response).toEqual(2)
    })
    it("returns 0 if no ticketCount", async () => {
      await mongo.loadEventTickets()
      const context = { mongo }
      const response = await resolvers.EventSession.ticketCount(eventSessionData[1], null, context)
      expect(response).toEqual(0)
    })
  })
  describe("tickets", () => {
    it("returns the eventTickets for that eventSession", async () => {
      await mongo.loadEventTickets()
      const context = { mongo }
      const response = await resolvers.EventSession.tickets(eventSessionData[0], null, context)
      expect(response).toEqual(eventTicketData)
    })
  })
})
