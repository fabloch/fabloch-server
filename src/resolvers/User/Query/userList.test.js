import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, userData } from "../../../testUtils/fixtures"

let mongo

describe("User Query resolvers", () => {
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

  describe("userList", () => {
    it("returns all users", async () => {
      await mongo.loadAdmin()
      await mongo.loadUsers()
      const user = admin
      const context = { mongo, user }
      const response = await resolvers.Query.userList(null, null, context)
      expect(response).toEqual([admin, ...userData])
    })
    it("raises error no context user", async () => {
      expect.assertions(1)
      await mongo.loadAdmin()
      await mongo.loadUsers()
      const user = null
      const context = { mongo, user }
      try {
        await resolvers.Query.userList(null, null, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated.")
      }
    })
    it("raises error context user is not admin", async () => {
      expect.assertions(1)
      await mongo.loadAdmin()
      await mongo.loadUsers()
      const user = userData[0]
      const context = { mongo, user }
      try {
        await resolvers.Query.userList(null, null, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated as admin.")
      }
    })
  })
})
