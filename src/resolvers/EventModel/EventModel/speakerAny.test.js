import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { eventModelData, userData } from "../../../testUtils/fixtures"

let mongo

describe("EventModel EventModel resolvers", () => {
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

  describe("speakerAny", () => {
    it("returns the linked speaker", async () => {
      await mongo.loadUsers()
      const context = { mongo }
      const response = await resolvers.EventModel.speakerAny(eventModelData[0], null, context)
      expect(response).toEqual(userData[0])
    })
    it("returns null if no linked speaker", async () => {
      await mongo.loadUsers()
      const context = { mongo }
      const response = await resolvers.EventModel.speakerAny(eventModelData[0], null, context)
      expect(response).toEqual(userData[0])
    })
  })
})
