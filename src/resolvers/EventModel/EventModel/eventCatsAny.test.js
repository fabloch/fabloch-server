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

  describe("eventCatsAny", () => {
    it("returns eventModel eventCats", async () => {
      const user = userData[0]
      const context = { mongo, user }
      const response = await resolvers.EventModel.eventCatsAny(eventModelData[0], null, context)
      expect(response).toEqual(eventModelData[0].eventCats)
    })
  })
})
