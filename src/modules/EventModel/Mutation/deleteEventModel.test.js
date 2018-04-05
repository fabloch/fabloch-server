import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, eventModelData } from "../../../testUtils/fixtures"

let mongo

describe("deleteEventModel", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("valid", async () => {
    it("returns true", async () => {
      await mongo.loadEventModels()
      const user = admin
      const context = { mongo, user }
      const eventModelId = eventModelData[0]._id.toString()
      const response = await resolvers.Mutation.deleteEventModel(null, { eventModelId }, context)
      expect(response).toBeTruthy()
    })
    it("deletes the eventModel and linked eventSessions eventTickets", async () => {
      await mongo.loadEventModels()
      await mongo.loadEventSessions()
      await mongo.loadEventTickets()
      const user = admin
      const context = { mongo, user }
      const eventModelId = eventModelData[0]._id.toString()
      await resolvers.Mutation.deleteEventModel(null, { eventModelId }, context)
      const eventModel = await mongo.EventModels.findOne({ _id: eventModelData[0]._id })
      const eventSessions = await mongo.EventSessions
        .find({ eventModelId: eventModelData[0]._id }).toArray()
      const eventTickets = await mongo.EventTickets.find({}).toArray()
      expect(eventModel).toBeNull()
      expect(eventSessions).toHaveLength(0)
      expect(eventTickets).toHaveLength(0)
    })
    it("sends email to ticket owners")
  })
})
