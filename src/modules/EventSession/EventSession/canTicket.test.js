import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventSessionData, userData } from "../../../testUtils/fixtures"

let mongo


describe("EventSession EventSession resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("canTicket", () => {
    it("returns false if user has ticket", async () => {
      await mongo.loadEventModels()
      await mongo.loadEventSessions()
      await mongo.loadEventTickets()
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventSession.canTicket(eventSessionData[0], null, context)
      expect(response).toBeFalsy()
    })
    it("returns false if event full", async () => {
      await mongo.loadEventModels()
      await mongo.loadEventSessions()
      await mongo.loadEventTickets()
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventSession.canTicket(eventSessionData[1], null, context)
      expect(response).toBeFalsy()
    })
    it("returns true if seats available", async () => {
      await mongo.loadEventModels()
      await mongo.loadEventSessions()
      await mongo.loadEventTickets()
      const user = userData[1]
      const context = { mongo, user }
      const response = await resolvers.EventSession.canTicket(eventSessionData[0], null, context)
      expect(response).toBeTruthy()
    })
    it("returns true if no seats limit", async () => {
      await mongo.loadEventModels()
      await mongo.loadEventSessions()
      await mongo.loadEventTickets()
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventSession.canTicket(eventSessionData[2], null, context)
      expect(response).toBeTruthy()
    })
    it("returns false if no user", async () => {
      await mongo.loadEventModels()
      await mongo.loadEventSessions()
      await mongo.loadEventTickets()
      const user = null
      const context = { mongo, user }
      const response = await resolvers.EventSession.canTicket(eventSessionData[0], null, context)
      expect(response).toBeFalsy()
    })
  })
})
