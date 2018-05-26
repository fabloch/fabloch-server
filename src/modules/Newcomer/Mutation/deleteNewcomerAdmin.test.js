import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, newcomerData } from "../../../testUtils/fixtures"

let mongo

describe("deleteNewcomers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("valid", async () => {
    it("returns true", async () => {
      await mongo.loadNewcomers()
      const user = admin
      const context = { mongo, user }
      const newcomerId = newcomerData[0]._id.toString()
      const response = await resolvers.Mutation
        .deleteNewcomerAdmin(null, { newcomerId }, context)
      expect(response).toBeTruthy()
    })
    it("deletes in DB", async () => {
      await mongo.loadNewcomers()
      const context = { mongo, user: admin }
      const newcomerId = newcomerData[0]._id.toString()
      await resolvers.Mutation.deleteNewcomerAdmin(null, { newcomerId }, context)

      const newcomer = await mongo.Newcomers.findOne({ _id: newcomerData[0]._id })
      expect(newcomer).toBeNull()
    })
  })
})
