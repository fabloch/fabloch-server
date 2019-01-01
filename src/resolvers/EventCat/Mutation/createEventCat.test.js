import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, userData } from "../../../testUtils/fixtures"

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

  describe("createEventCat", () => {
    it("creates an eventCat", async () => {
      await mongo.loadUsers()
      const user = admin
      const context = { mongo, user }
      const eventCatInput = {
        name: "Awesome EventCat",
        color: "red",
      }
      const response = await resolvers.Mutation.createEventCat(null, { eventCatInput }, context)
      expect(response).toMatchObject(eventCatInput)
    })
    it("raises an error if no user in context", async () => {
      expect.assertions(1)
      const user = null
      const context = { mongo, user }
      const eventCatInput = { name: "Awesome EventCat" }
      try {
        await resolvers.Mutation.createEventCat(null, { eventCatInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated.")
      }
    })
    it("raises an error if not admin", async () => {
      expect.assertions(1)
      const user = userData[0]
      const context = { mongo, user }
      const eventCatInput = { name: "Awesome EventCat" }
      try {
        await resolvers.Mutation.createEventCat(null, { eventCatInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated as admin.")
      }
    })
    it("raises if no name", async () => {
      expect.assertions(2)
      const user = admin
      const context = { mongo, user }
      const eventCatInput = {}
      try {
        await resolvers.Mutation.createEventCat(null, { eventCatInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to create event category.")
        expect(e.validationErrors).toEqual({ name: ["Name is missing."] })
      }
    })
    it("raises if name too short", async () => {
      expect.assertions(2)
      const user = admin
      const context = { mongo, user }
      const eventCatInput = { name: "a" }
      try {
        await resolvers.Mutation.createEventCat(null, { eventCatInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to create event category.")
        expect(e.validationErrors).toEqual({ name: ["Name should have at least 2 characters."] })
      }
    })
    it("raises if name too longx", async () => {
      expect.assertions(2)
      const user = admin
      const context = { mongo, user }
      const eventCatInput = { name: "a".repeat(40) }
      try {
        await resolvers.Mutation.createEventCat(null, { eventCatInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to create event category.")
        expect(e.validationErrors).toEqual({ name: ["Name should have less than 40 characters."] })
      }
    })
  })
})
