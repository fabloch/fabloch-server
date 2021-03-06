import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { eventSessionData, eventTicketData } from "../../../testUtils/fixtures"

let mongo

describe("EventSession EventSession resolvers", () => {
  beforeAll(async () => {
    mongo = await connectMongo()
  })
  beforeEach(async () => {
    await mongo.beforeEach()
  })
  afterEach(async () => {
    await mongo.afterEach()
  })
  afterAll(async () => {
    await mongo.afterAll()
  })

  describe("tickets", () => {
    it("returns the eventTickets for that eventSession", async () => {
      await mongo.loadEventTickets()
      const context = { mongo }
      const response = await resolvers.EventSession.tickets(eventSessionData[0], null, context)
      expect(response).toEqual([eventTicketData[0]])
    })
  })
})
