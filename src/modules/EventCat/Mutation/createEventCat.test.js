import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { admin } from "../../../testUtils/fixtures"

let mongo

describe("EventCat Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("createEventCat", async () => {
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
      expect.assertions(2)
      const user = null
      const context = { mongo, user }
      const eventCatInput = { name: "Awesome EventCat" }
      try {
        await resolvers.Mutation.createEventCat(null, { eventCatInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Unauthenticated."] })
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
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ name: ["Missing name."] })
      }
    })
  })
})
