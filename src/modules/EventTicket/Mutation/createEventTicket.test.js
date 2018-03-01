import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventSessionData, userData } from "../../../testUtils/fixtures"

let mongo

describe("createEventTicket", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("valid", () => {
    it("creates eventTicket", async () => {
      await mongo.loadUsers()
      await mongo.loadEventSessions()
      const user = userData[0]
      const context = { mongo, user }
      const eventTicketInput = {
        eventSessionId: eventSessionData[0]._id.toString(),
      }
      const response = await resolvers.Mutation.createEventTicket(null, { eventTicketInput }, context)
      expect(response).toMatchObject({
        eventSessionId: eventSessionData[0]._id,
        ownerId: userData[0]._id,
      })
    })
  })
  describe("invalid", () => {
    it("raises error if no eventSession", async () => {
      await mongo.loadUsers()
      await mongo.loadEventSessions()
      const user = userData[0]
      const context = { mongo, user }
      const eventTicketInput = {
        eventSessionId: "5a4a5ee36454c9d6369cca5f",
      }
      expect.assertions(2)
      try {
        await resolvers.Mutation.createEventTicket(null, { eventTicketInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["EventSession does not exist."] })
      }
    })
    it("raises error if no more seats", async () => {
      expect.assertions(2)
      await mongo.loadUsers()
      await mongo.loadEventSessions()
      await mongo.loadEventTickets()
      await mongo.loadEventModels()
      const user = userData[0]
      const context = { mongo, user }
      const eventTicketInput = {
        eventSessionId: eventSessionData[1]._id.toString(),
      }
      try {
        await resolvers.Mutation.createEventTicket(null, { eventTicketInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["No more seats for that eventSession."] })
      }
    })
    it("raises error if already an eventTicket for user and eventSession", async () => {
      expect.assertions(2)
      await mongo.loadUsers()
      await mongo.loadEventSessions()
      const user = userData[0]
      const context = { mongo, user }
      const eventTicketInput = {
        eventSessionId: eventSessionData[0]._id.toString(),
      }
      await resolvers.Mutation.createEventTicket(null, { eventTicketInput }, context)
      try {
        await resolvers.Mutation.createEventTicket(null, { eventTicketInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["User already has a ticket for that eventSession."] })
      }
    })
    // it("doesn't create eventTicket if now > end")
    // it("doesn't create eventTicket if eventSession.pris and no eventTicket.payment")
  })
})
