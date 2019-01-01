import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { eventSessionData, userData } from "../../../testUtils/fixtures"

let mongo

describe("EventSession EventSession resolvers", () => {
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

  describe("speakerPrnt", () => {
    it("returns the eventModel speaker (eventSession0A)", async () => {
      await mongo.loadEventModels()
      await mongo.loadUsers()
      const context = { mongo }
      const response = await resolvers.EventSession.speakerPrnt(eventSessionData[0], null, context)
      expect(response).toEqual(userData[0])
    })
  })
})
