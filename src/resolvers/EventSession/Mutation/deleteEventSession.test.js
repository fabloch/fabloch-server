import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, eventSessionData, userData } from "../../../testUtils/fixtures"

let mongo

describe("deleteEventSession", () => {
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

  describe("valid", () => {
    it("returns true", async () => {
      await mongo.loadEventSessions()
      const user = admin
      const context = { mongo, user }
      const eventSessionId = eventSessionData[0]._id.toString()
      const response = await resolvers.Mutation.deleteEventSession(
        null,
        { eventSessionId },
        context,
      )
      expect(response).toBeTruthy()
    })
    it("deletes the eventSession and linked eventSessions eventTickets", async () => {
      await mongo.loadEventSessions()
      await mongo.loadEventTickets()
      const user = admin
      const context = { mongo, user }
      const eventSessionId = eventSessionData[0]._id.toString()
      await resolvers.Mutation.deleteEventSession(null, { eventSessionId }, context)
      const eventSession = await mongo.EventSessions.findOne({ _id: eventSessionData[0]._id })
      const eventTickets = await mongo.EventTickets.find({
        id: eventSessionData[0]._id,
      }).toArray()
      expect(eventSession).toBeNull()
      expect(eventTickets).toHaveLength(0)
    })
    it("sends email to ticket owners", () => {})
  })
  describe("invalid", () => {
    it("raises error if no user in context", async () => {
      expect.assertions(1)
      const user = null
      const context = { mongo, user }
      const eventSessionId = eventSessionData[0]._id.toString()
      try {
        await resolvers.Mutation.deleteEventSession(null, { eventSessionId }, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated.")
      }
    })
    it("raises an error if user does not own eventSession", async () => {
      expect.assertions(1)
      await mongo.loadEventSessions()
      const user = userData[1]
      const context = { mongo, user }
      const eventSessionId = eventSessionData[0]._id.toString()

      try {
        await resolvers.Mutation.deleteEventSession(null, { eventSessionId }, context)
      } catch (e) {
        expect(e.message).toEqual("Not owner or admin.")
      }
    })
  })
})
