import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventModelData, userData } from "../../../testUtils/fixtures"

let mongo

describe("EventModel EventModel resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("owner", () => {
    it("returns user", async () => {
      await mongo.loadUsers()
      const context = { mongo }
      const response = await resolvers.EventModel.owner(eventModelData[0], null, context)
      expect(response).toEqual(userData[0])
    })
  })
})
