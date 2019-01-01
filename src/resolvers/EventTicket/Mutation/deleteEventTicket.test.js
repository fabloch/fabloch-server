import { ObjectId } from "mongodb"
import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, eventTicketData, userData } from "../../../testUtils/fixtures"

let mongo

describe("deleteEventTicket", () => {
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
    it("user can delete its ticket", async () => {
      await mongo.loadUsers()
      await mongo.loadEventTickets()
      const user = userData[0]
      const context = { mongo, user }
      const eventTicketId = eventTicketData[0]._id.toString()
      const response = await resolvers.Mutation.deleteEventTicket(null, { eventTicketId }, context)
      expect(response).toBeTruthy()
      const previousEventTicket = await mongo.EventTickets.findOne({
        _id: ObjectId("5a4d56eeb230a538a7efb8e1"),
      })
      expect(previousEventTicket).toBeNull()
    })
    it("admin can delete a ticket", async () => {
      await mongo.loadUsers()
      await mongo.loadEventTickets()
      const user = admin
      const context = { mongo, user }
      const eventTicketId = eventTicketData[0]._id.toString()
      const response = await resolvers.Mutation.deleteEventTicket(null, { eventTicketId }, context)
      expect(response).toBeTruthy()
      const previousEventTicket = await mongo.EventTickets.findOne({
        _id: ObjectId("5a4d56eeb230a538a7efb8e1"),
      })
      expect(previousEventTicket).toBeNull()
    })
  })
  describe("invalid", () => {
    it("user can't delete someone else's ticket", async () => {
      expect.assertions(1)
      await mongo.loadUsers()
      await mongo.loadEventTickets()
      const user = userData[1]
      const context = { mongo, user }
      const eventTicketId = eventTicketData[0]._id.toString()
      try {
        await resolvers.Mutation.deleteEventTicket(null, { eventTicketId }, context)
      } catch (e) {
        expect(e.message).toEqual("Not owner or admin.")
      }
    })
  })
})
