import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, userData } from "../../../testUtils/fixtures"

let mongo

describe("User Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("deleteUserAdmin", async () => {
    it("deletes the user", async () => {
      await mongo.loadUsers()
      const user = admin
      const context = { mongo, user }
      const userId = userData[0]._id.toString()
      await resolvers.Mutation.deleteUserAdmin(null, { userId }, context)
      expect(await mongo.Users.find().toArray()).toHaveLength(1)
    })
    it("deletes the user's tickets", async () => {
      await mongo.loadUsers()
      await mongo.loadEventTickets()
      const user = admin
      const context = { mongo, user }
      const userId = userData[0]._id.toString()
      await resolvers.Mutation.deleteUserAdmin(null, { userId }, context)
      expect(await mongo.EventTickets.find().toArray()).toHaveLength(1)
    })
    it("raises an error if no user in context", async () => {
      expect.assertions(2)
      const user = null
      const context = { mongo, user }
      const userId = userData[0]._id.toString()
      try {
        await resolvers.Mutation.deleteUserAdmin(null, { userId }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Unauthenticated."] })
      }
    })
    it("raises error if not admin", async () => {
      expect.assertions(2)
      const user = userData[0]
      const context = { mongo, user }
      const userId = userData[0]._id.toString()
      try {
        await resolvers.Mutation.deleteUserAdmin(null, { userId }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Not allowed."] })
      }
    })
  })
})
