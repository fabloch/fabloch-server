import { ObjectId } from "mongodb"
import resolvers from "./resolvers"
import connectMongo from "../../testUtils/mongoTest"
import { eventData } from "../../testUtils/fixtures"

let mongo

describe("Event resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(() => mongo.afterEach())
  afterAll(() => { mongo.tearDown() })

  describe("Query", () => {
    describe("allEvents", () => {
      it("returns empty array if no events", async () => {
        const context = { mongo }
        const response = await resolvers.Query.allEvents(null, null, context)
        expect(response).toEqual([])
      })
      it("returns all events from db", async () => {
        await mongo.loadEvents()
        const context = { mongo }
        const response = await resolvers.Query.allEvents(null, null, context)
        expect(response).toEqual(eventData)
      })
    })
    describe("eventDetail", () => {
      it("returns the event from the id", async () => {
        await mongo.loadEvents()
        const context = { mongo }
        const response = await resolvers.Query.eventDetail(null, { id: "5a4a5eb6404da6d636078beb" }, context)
        expect(response).toEqual(eventData[0])
      })
    })
    it("throws an error if no event with that id", async () => {
      const context = { mongo }
      try {
        await resolvers.Query.eventDetail(null, { id: "5a4a5eb6404da6d6360734eb" }, context)
      } catch (e) {
        expect(e.message).toEqual("Event does not exist.")
      }
    })
  })
  describe("Mutation", () => {
    describe("createEvent", () => {
      it("creates an event with the user as owner", async () => {
        await mongo.loadUsers()
        const user = await mongo.Users.findOne({ email: "user1@example.com" })
        const context = { mongo, user }
        const event = { title: "Awesome Event", seats: 10 }
        const response = await resolvers.Mutation.createEvent(null, { event }, context)
        expect(response).toMatchObject({
          title: "Awesome Event",
          ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
          seats: 10,
        })
      })
      it("raises an error if no user in context", async () => {
        const user = null
        const context = { mongo, user }
        const event = { title: "Awesome Event" }
        try {
          await resolvers.Mutation.createEvent(null, { event }, context)
        } catch (e) {
          expect(e.message).toMatch("Unauthenticated.")
        }
      })
    })
  })
})
