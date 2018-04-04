import { ObjectId } from "mongodb"
import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventSessionData, userData } from "../../../testUtils/fixtures"

let mongo


describe("deleteEventTicket", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("valid", () => {
    it("deletes eventTicket", async () => {
      await mongo.loadUsers()
      await mongo.loadEventSessions()
      await mongo.loadEventTickets()
      const user = userData[0]
      const context = { mongo, user }
      const eventTicketInput = {
        eventSessionId: eventSessionData[0]._id.toString(),
      }
      const response = await resolvers.Mutation
        .deleteEventTicket(null, { eventTicketInput }, context)
      expect(response).toBeTruthy()
      const previousEventTicket = await mongo.EventTickets.findOne({ _id: ObjectId("5a4d56eeb230a538a7efb8e1") })
      expect(previousEventTicket).toBeNull()
    })
  })
})
