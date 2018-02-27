import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventModelData, eventTicketData, userData } from "../../../testUtils/fixtures"

let mongo

describe("EventModel EventModel resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("id", () => {
    it("returns _id from db", () => {
      expect(resolvers.EventModel.id(eventModelData[0])).toEqual("5a4a5eb6404da6d636078beb")
    })
  })
  describe("owner", () => {
    it("returns user", async () => {
      await mongo.loadUsers()
      const context = { mongo }
      const response = await resolvers.EventModel.owner(eventModelData[0], null, context)
      expect(response).toEqual(userData[0])
    })
  })
  describe("tickets", () => {
    it("returns the eventTickets for that eventModel", async () => {
      await mongo.loadEventTickets()
      const context = { mongo }
      const response = await resolvers.EventModel.tickets(eventModelData[0], null, context)
      expect(response).toEqual(eventTicketData)
    })
  })
})
