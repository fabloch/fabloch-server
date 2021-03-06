import { ObjectId } from "mongodb"
import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { userData, dateUtils } from "../../../testUtils/fixtures"

let mongo

describe("User User resolver", () => {
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

  describe("memberships", () => {
    it("returns user's memberships", async () => {
      await mongo.loadUsers()
      await mongo.loadMemberships()
      const [user] = userData
      const context = { mongo, user }
      const response = await resolvers.User.memberships(user, null, context)
      expect(response).toMatchObject([
        {
          _id: ObjectId("5a383f36d2834c317755ab17"),
          plan: "PERSO",
          start: dateUtils.user1membership1Start,
          end: dateUtils.user1membership1End,
          ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
        },
        {
          _id: ObjectId("5a383ffe50e6413193171110"),
          plan: "PERSO",
          start: dateUtils.user1membership2Start,
          end: dateUtils.user1membership2End,
          ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
        },
      ])
    })
  })
})
