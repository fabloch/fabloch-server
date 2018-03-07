import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, eventCatData } from "../../../testUtils/fixtures"

let mongo

describe("EventCat Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("updateEventCat", async () => {
    it("updates an eventCat", async () => {
      await mongo.loadEventCats()
      const user = admin
      const context = { mongo, user }
      const eventCatInput = {
        id: eventCatData[0]._id.toString(),
        name: "Awesome EventCat",
      }
      const response = await resolvers.Mutation.updateEventCat(null, { eventCatInput }, context)
      expect(response.name).toEqual(eventCatInput.name)
    })
    it("updates all linked eventModels", async () => {
      await mongo.loadEventCats()
      await mongo.loadEventModels()
      const user = admin
      const context = { mongo, user }
      const eventCatInput = {
        id: eventCatData[0]._id.toString(),
        name: "Changed name",
      }
      await resolvers.Mutation.updateEventCat(null, { eventCatInput }, context)
      const eventModels = await mongo.EventModels.find({ "eventCats.id": eventCatData[0]._id }).toArray()
      expect(eventModels).toHaveLength(1)
      const eventCatList = eventModels.map(em =>
        em.eventCats.filter(ec => ec.id.toString() === eventCatData[0]._id.toString())[0])
      eventCatList.map(ec => expect(ec.name).toEqual("Changed name"))
    })
    it("updates all linked eventSessions", async () => {
      await mongo.loadEventCats()
      await mongo.loadEventSessions()
      const user = admin
      const context = { mongo, user }
      const eventCatInput = {
        id: eventCatData[2]._id.toString(),
        name: "Changed name",
      }
      await resolvers.Mutation.updateEventCat(null, { eventCatInput }, context)
      const eventSessions = await mongo.EventSessions.find({ "eventCats.id": eventCatData[2]._id }).toArray()
      expect(eventSessions).toHaveLength(2)
      const eventCatList = eventSessions.map(es =>
        es.eventCats.filter(ec => ec.id.toString() === eventCatData[2]._id.toString())[0])
      eventCatList.map(ec => expect(ec.name).toEqual("Changed name"))
    })
    it("raises an error if no user in context", async () => {
      expect.assertions(2)
      const user = null
      const context = { mongo, user }
      const eventCatInput = {
        id: eventCatData[0]._id.toString(),
        name: "Awesome EventCat",
      }
      try {
        await resolvers.Mutation.updateEventCat(null, { eventCatInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Unauthenticated."] })
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
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ name: ["Missing name."] })
      }
    })
  })
})
