import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventSessionData, userData } from "../../../testUtils/fixtures"

let mongo


describe("EventSession EventSession resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("userStatus", () => {
    it("returns false if user has ticket", async () => {
      await mongo.loadEventModels()
      await mongo.loadEventSessions()
      await mongo.loadEventTickets()
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventSession.userStatus(eventSessionData[0], null, context)
      expect(response).toEqual({ canTicket: false, info: "hasTicket" })
    })
    it("returns false if event full", async () => {
      await mongo.loadEventModels()
      await mongo.loadEventSessions()
      await mongo.loadEventTickets()
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventSession.userStatus(eventSessionData[1], null, context)
      expect(response).toEqual({ canTicket: false, info: "full" })
    })
    it("returns true if seats available", async () => {
      await mongo.loadEventModels()
      await mongo.loadEventSessions()
      await mongo.loadEventTickets()
      const user = userData[1]
      const context = { mongo, user }
      const response = await resolvers.EventSession.userStatus(eventSessionData[0], null, context)
      expect(response).toEqual({ canTicket: true, info: "seatsLeft" })
    })
    it("returns true if no seats limit", async () => {
      await mongo.loadEventModels()
      await mongo.loadEventSessions()
      await mongo.loadEventTickets()
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventSession.userStatus(eventSessionData[2], null, context)
      expect(response).toEqual({ canTicket: true, info: "noLimit" })
    })
    it("returns false if no user", async () => {
      await mongo.loadEventModels()
      await mongo.loadEventSessions()
      await mongo.loadEventTickets()
      const user = null
      const context = { mongo, user }
      const response = await resolvers.EventSession.userStatus(eventSessionData[0], null, context)
      expect(response).toEqual({ canTicket: false, info: "noUser" })
    })
    describe("overlapping", () => {
      it("returns false if overlapping event (start - 15)", async () => {
        await mongo.loadEventModels()
        await mongo.loadEventSessions()
        await mongo.loadEventTickets()
        const user = userData[0]
        const context = { mongo, user }
        const response = await resolvers.EventSession
          .userStatus(eventSessionData[4], null, context)
        expect(response).toEqual({
          canTicket: false,
          info: "overlap",
          overlapping: eventSessionData[0],
        })
      })
      it("returns false if overlapping event (end + 15)", async () => {
        await mongo.loadEventModels()
        await mongo.loadEventSessions()
        await mongo.loadEventTickets()
        const user = userData[0]
        const context = { mongo, user }
        const response = await resolvers.EventSession
          .userStatus(eventSessionData[5], null, context)
        expect(response).toEqual({
          canTicket: false,
          info: "overlap",
          overlapping: eventSessionData[0],
        })
      })
    })
  })
})
