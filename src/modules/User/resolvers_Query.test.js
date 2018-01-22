import { ObjectId } from "mongodb"
import resolvers from "./resolvers"
import connectMongo from "../../testUtils/mongoTest"

let mongo

describe("User Query resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("user", () => {
    it("returns user from context", async () => {
      await mongo.loadUsers()
      const user = await mongo.Users.findOne({ email: "user1@example.com" })
      const context = { user }
      return resolvers.Query.user(null, null, context).then((results) => {
        expect(results).toEqual({
          _id: ObjectId("5a31b456c5e7b54a9aba3782"),
          username: "user1",
          email: "user1@example.com",
          password: "$2a$10$Htm2b52NAP2XE5pD8LnK2OP58PTf9kXxaEtKxMmbI28Udappwayy6",
          version: 1,
        })
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
