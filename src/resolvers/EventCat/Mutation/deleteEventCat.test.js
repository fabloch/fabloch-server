import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, eventCatData, userData } from "../../../testUtils/fixtures"

let mongo

describe("EventCat Mutation resolvers", () => {
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

  describe("deleteEventCat", () => {
    it("deletes an eventCat", async () => {
      await mongo.loadEventCats()
      const user = admin
      const context = { mongo, user }
      const eventCatId = eventCatData[0]._id.toString()
      await resolvers.Mutation.deleteEventCat(null, { eventCatId }, context)
      expect(await mongo.EventCats.find().toArray()).toHaveLength(3)
    })
    it("deletes all references in eventModels", async () => {
      await mongo.loadEventCats()
      await mongo.loadEventModels()
      const user = admin
      const context = { mongo, user }
      const eventCatId = eventCatData[0]._id.toString()
      await resolvers.Mutation.deleteEventCat(null, { eventCatId }, context)
      const eventModels = await mongo.EventModels.find({
        "eventCats.id": eventCatData[0]._id,
      }).toArray()
      expect(eventModels).toHaveLength(0)
    })
    it("deletes all references in eventSessions", async () => {
      await mongo.loadEventCats()
      await mongo.loadEventSessions()
      const user = admin
      const context = { mongo, user }
      const eventCatId = eventCatData[2]._id.toString()
      await resolvers.Mutation.deleteEventCat(null, { eventCatId }, context)
      const eventSessions = await mongo.EventSessions.find({
        "eventCats.id": eventCatData[2]._id,
      }).toArray()
      expect(eventSessions).toHaveLength(0)
    })
    it("raises error if not admin", async () => {
      expect.assertions(1)
      const user = userData[0]
      const context = { mongo, user }
      const eventCatId = eventCatData[0]._id.toString()
      try {
        await resolvers.Mutation.deleteEventCat(null, { eventCatId }, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated as admin.")
      }
    })
  })
})
