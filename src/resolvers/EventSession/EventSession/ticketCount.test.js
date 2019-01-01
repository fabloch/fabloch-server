import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { eventSessionData } from "../../../testUtils/fixtures"

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

  describe("ticketCount", () => {
    it("returns the number of tickets for the eventSession", async () => {
      await mongo.loadEventTickets()
      const context = { mongo }
      const response = await resolvers.EventSession.ticketCount(eventSessionData[0], null, context)
      expect(response).toEqual(1)
      const response2 = await resolvers.EventSession.ticketCount(eventSessionData[1], null, context)
      expect(response2).toEqual(1)
    })
    it("returns 0 if no ticketCount", async () => {
      await mongo.loadEventTickets()
      const context = { mongo }
      const response = await resolvers.EventSession.ticketCount(eventSessionData[3], null, context)
      expect(response).toEqual(0)
    })
  })
})
