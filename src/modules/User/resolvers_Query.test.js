import resolvers from "./resolvers"
import connectMongo from "../../testUtils/mongoTest"
import { userData } from "../../testUtils/fixtures"

let mongo

describe("User Query resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("user", () => {
    it("returns user from context", async () => {
      await mongo.loadUsers()
      const user = userData[0]
      const context = { user }
      return resolvers.Query.user(null, null, context).then((results) => {
        expect(results).toEqual(userData[0])
      })
    })

    it("returns null if no user", async () => {
      const user = null
      const context = { user }
      return resolvers.Query.user(null, null, context).then((results) => {
        expect(results).toEqual(null)
      })
    })
  })
})
