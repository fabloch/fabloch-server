import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, userData } from "../../../testUtils/fixtures"

let mongo

describe("User User resolver", () => {
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

  describe("isAdmin", () => {
    it("returns true if admin in user's roles", async () => {
      await mongo.loadAdmin()
      const context = { mongo, admin }
      const response = await resolvers.User.isAdmin(admin, null, context)
      expect(response).toBeTruthy()
    })
    it("returns false if admin not in user's roles", async () => {
      await mongo.loadUsers()
      const [user] = userData
      const context = { mongo, user }
      const response = await resolvers.User.isAdmin(user, null, context)
      expect(response).toBeFalsy()
    })
  })
})
