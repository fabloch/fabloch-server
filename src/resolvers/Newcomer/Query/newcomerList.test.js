import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, newcomerData, userData } from "../../../testUtils/fixtures"

let mongo

describe("Newcomer Query resolvers", () => {
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

  describe("newcomerList", () => {
    it("returns all newcomers", async () => {
      await mongo.loadAdmin()
      await mongo.loadNewcomers()
      const context = { mongo, user: admin }
      const response = await resolvers.Query.newcomerList(null, null, context)
      expect(response).toEqual(newcomerData)
    })
    it("raises error no context user", async () => {
      expect.assertions(1)
      await mongo.loadAdmin()
      await mongo.loadNewcomers()
      const context = { mongo }
      try {
        await resolvers.Query.newcomerList(null, null, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated.")
      }
    })
    it("raises error context user is not admin", async () => {
      expect.assertions(1)
      await mongo.loadAdmin()
      await mongo.loadNewcomers()
      const user = userData[0]
      const context = { mongo, user }
      try {
        await resolvers.Query.newcomerList(null, null, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated as admin.")
      }
    })
  })
})
