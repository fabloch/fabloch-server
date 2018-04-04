import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, eventSessionData } from "../../../testUtils/fixtures"

let mongo

describe("deleteEventSession", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("valid", async () => {
    it("returns true", async () => {
      await mongo.loadEventSessions()
      const user = admin
      const context = { mongo, user }
      const eventSessionId = eventSessionData[0]._id.toString()
      const response = await resolvers.Mutation
        .deleteEventSession(null, { eventSessionId }, context)
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
      const eventTickets = await mongo.EventTickets
        .find({ eventSessionId: eventSessionData[0]._id }).toArray()
      expect(eventSession).toBeNull()
      expect(eventTickets).toHaveLength(1)
    })
  })
})
