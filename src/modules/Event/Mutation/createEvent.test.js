import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, userData } from "../../../testUtils/fixtures"

let mongo

describe("Event Mutation createEvent", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("for an admin", async () => {
    it("creates an event with admin true", async () => {
      const user = admin
      const context = { mongo, user }
      const eventInput = {
        title: "Awesome Event",
        description: "This event is awesome and this is its description.\nAnother line.",
        seats: 10,
        start: "2018-09-16T08:30Z",
        end: "2018-09-16T13:00Z",
      }
      const response = await resolvers.Mutation.createEvent(null, { eventInput }, context)
      expect(response).toMatchObject({
        title: "Awesome Event",
        description: "This event is awesome and this is its description.\nAnother line.",
        ownerId: user._id,
        seats: 10,
        start: "2018-09-16T08:30Z",
        end: "2018-09-16T13:00Z",
        admin: true,
      })
    })
  })
  describe("for a normal user", async () => {
    it("creates an event with the user as owner", async () => {
      const user = userData[0]
      const context = { mongo, user }
      const eventInput = {
        title: "Awesome Event",
        description: "This event is awesome and this is its description.\nAnother line.",
        seats: 10,
        start: "2018-09-16T08:30Z",
        end: "2018-09-16T13:00Z",
      }
      const response = await resolvers.Mutation.createEvent(null, { eventInput }, context)
      expect(response).toMatchObject({
        title: "Awesome Event",
        description: "This event is awesome and this is its description.\nAnother line.",
        ownerId: user._id,
        seats: 10,
        start: "2018-09-16T08:30Z",
        end: "2018-09-16T13:00Z",
      })
    })
  })
  describe("errors", async () => {
    it("raises an error if no user in context", async () => {
      expect.assertions(2)
      const user = null
      const context = { mongo, user }
      const eventInput = { title: "Awesome Event" }
      try {
        await resolvers.Mutation.createEvent(null, { eventInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Unauthenticated."] })
      }
    })
    it("raises if no title, start, end", async () => {
      expect.assertions(2)
      const user = userData[0]
      const context = { mongo, user }
      const eventInput = {}
      try {
        await resolvers.Mutation.createEvent(null, { eventInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({
          title: ["Missing title."],
          start: ["Missing start."],
          end: ["Missing end."],
        })
      }
    })
    it("raises an error if start < now", async () => {
      expect.assertions(2)
      const user = userData[0]
      const context = { mongo, user }
      const eventInput = {
        title: "Awesome Event",
        description: "This event is awesome and this is its description",
        seats: 10,
        start: "2015-09-16T13:00Z",
        end: "2018-09-16T08:30Z",
      }
      try {
        await resolvers.Mutation.createEvent(null, { eventInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({
          start: ["Start date is in the past."],
        })
      }
    })
    it("raises an error if start < end", async () => {
      expect.assertions(2)
      const user = userData[0]
      const context = { mongo, user }
      const eventInput = {
        title: "Awesome Event",
        start: "2018-09-16T13:00Z",
        end: "2018-09-16T08:30Z",
      }
      try {
        await resolvers.Mutation.createEvent(null, { eventInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ start: ["Start date is after end date."] })
      }
    })
  })
})
