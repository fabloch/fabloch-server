import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventModelData, eventTicketData, userData } from "../../../testUtils/fixtures"

let mongo

describe("EventModel EventModel resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("bookings", () => {
    it("returns the number of tickets for the eventModel", async () => {
      await mongo.loadEventTickets()
      const context = { mongo }
      const response = await resolvers.EventModel.bookings(eventModelData[0], null, context)
      expect(response).toEqual(2)
    })
    it("returns 0 if no bookings", async () => {
      await mongo.loadEventTickets()
      const context = { mongo }
      const response = await resolvers.EventModel.bookings(eventModelData[1], null, context)
      expect(response).toEqual(0)
    })
  })
  describe("tickets", () => {
    it("returns the eventTickets for that eventModel", async () => {
      await mongo.loadEventTickets()
      const context = { mongo }
      const response = await resolvers.EventModel.tickets(eventModelData[0], null, context)
      expect(response).toEqual(eventTicketData)
    })
  })
})
