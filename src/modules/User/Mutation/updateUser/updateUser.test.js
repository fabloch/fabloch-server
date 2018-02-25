import resolvers from "../../resolvers"
import connectMongo from "../../../../testUtils/mongoTest"
import { userData } from "../../../../testUtils/fixtures"

let mongo

describe("User Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("updateUser", () => {
    it("with correct jwt, it updates user", async () => {
      await mongo.loadUsers()
      const [user] = userData
      const modifiedUser = { email: "another@email.com" }
      const context = { mongo, user }
      const response = await resolvers.Mutation.updateUser(null, modifiedUser, context)
      expect(response).toMatchObject({
        ...user,
        email: "another@email.com",
        version: 2,
      })
    })

    it("with no user from jwt, throws error", async () => {
      await mongo.loadUsers()
      const user = null
      const modifiedUser = { email: "another@email.com" }
      const context = { mongo, user }
      try {
        await resolvers.Mutation.updateUser(null, modifiedUser, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Unauthenticated."] })
      }
    })
  })
})
