import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventSessionData, userData } from "../../../testUtils/fixtures"

let mongo

describe("EventSession EventSession resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("hasTicket", () => {
    it("returns true if context user has a ticket for this eventSession", async () => {
      await mongo.loadEventSessions()
      await mongo.loadEventTickets()
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventSession.hasTicket(eventSessionData[0], null, context)
      expect(response).toBeTruthy()
    })
    it("returns false if context user has a ticket for this eventSession", async () => {
      await mongo.loadEventSessions()
      await mongo.loadEventTickets()
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventSession.hasTicket(eventSessionData[1], null, context)
      expect(response).toBeFalsy()
    })
  })
})
