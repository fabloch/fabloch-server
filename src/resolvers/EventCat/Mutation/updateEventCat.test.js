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

  describe("updateEventCat", () => {
    it("updates an eventCat", async () => {
      await mongo.loadEventCats()
      const user = admin
      const context = { mongo, user }
      const eventCatInput = {
        id: eventCatData[0]._id.toString(),
        name: "Awesome EventCat",
        color: "red",
      }
      const response = await resolvers.Mutation.updateEventCat(null, { eventCatInput }, context)
      expect(response.name).toEqual(eventCatInput.name)
      expect(response.color).toEqual(eventCatInput.color)
    })
    it("updates all linked eventModels", async () => {
      await mongo.loadEventCats()
      await mongo.loadEventModels()
      const user = admin
      const context = { mongo, user }
      const eventCatInput = {
        id: eventCatData[0]._id.toString(),
        name: "Changed name",
        color: "red",
      }
      await resolvers.Mutation.updateEventCat(null, { eventCatInput }, context)
      const eventModels = await mongo.EventModels.find({
        "eventCats.id": eventCatData[0]._id,
      }).toArray()
      expect(eventModels).toHaveLength(1)
      const eventCatList = eventModels.map(
        em => em.eventCats.filter(ec => ec.id.toString() === eventCatData[0]._id.toString())[0],
      )
      eventCatList.map(ec => {
        expect(ec.name).toEqual("Changed name")
        expect(ec.color).toEqual("red")
        return true
      })
    })
    it("updates all linked eventSessions", async () => {
      await mongo.loadEventCats()
      await mongo.loadEventSessions()
      const user = admin
      const context = { mongo, user }
      const eventCatInput = {
        id: eventCatData[2]._id.toString(),
        name: "Changed name",
        color: "red",
      }
      await resolvers.Mutation.updateEventCat(null, { eventCatInput }, context)
      const eventSessions = await mongo.EventSessions.find({
        "eventCats.id": eventCatData[2]._id,
      }).toArray()
      expect(eventSessions).toHaveLength(3)
      const eventCatList = eventSessions.map(
        es => es.eventCats.filter(ec => ec.id.toString() === eventCatData[2]._id.toString())[0],
      )
      eventCatList.map(ec => {
        expect(ec.name).toEqual("Changed name")
        expect(ec.color).toEqual("red")
        return true
      })
    })
    it("raises an error if not admin", async () => {
      expect.assertions(1)
      const user = userData[0]
      const context = { mongo, user }
      const eventCatInput = {
        id: eventCatData[0]._id.toString(),
        name: "Awesome EventCat",
        color: "red",
      }
      try {
        await resolvers.Mutation.updateEventCat(null, { eventCatInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated as admin.")
      }
    })
    it("raises if no name", async () => {
      expect.assertions(2)
      const user = admin
      const context = { mongo, user }
      const eventCatInput = {
        id: eventCatData[0]._id.toString(),
      }
      try {
        await resolvers.Mutation.updateEventCat(null, { eventCatInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to update event category.")
        expect(e.validationErrors).toEqual({ name: ["Name is missing."] })
      }
    })
  })
})
