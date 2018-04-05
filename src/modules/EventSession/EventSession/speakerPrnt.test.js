import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { eventSessionData, userData } from "../../../testUtils/fixtures"

let mongo


describe("EventSession EventSession resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("speaker", () => {
    it("returns the eventModel speaker (eventSession0A)", async () => {
      await mongo.loadEventModels()
      await mongo.loadUsers()
      const context = { mongo }
      const response = await resolvers.EventSession.speaker(eventSessionData[1], null, context)
      expect(response).toEqual(userData[1])
    })
    it("returns null if no evenModel speaker", async () => {
      await mongo.loadEventModels()
      await mongo.loadUsers()
      const context = { mongo }
      const response = await resolvers.EventSession.speaker(eventSessionData[0], null, context)
      expect(response).toEqual(null)
    })
  })
})
