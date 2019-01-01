import { ObjectId } from "mongodb"
import moment from "moment"
import resolvers from "./resolvers"
import connectMongo from "../../testUtils/mongoTest"
import { membershipData, dateUtils } from "../../testUtils/fixtures"

let mongo

describe("Membership Query resolvers", () => {
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

  describe("userMembershipData", () => {
    describe("for user1@example.com", () => {
      it("returns the context user's membershipData", async () => {
        await mongo.loadUsers()
        await mongo.loadMemberships()
        const user = await mongo.Users.findOne({ email: "user1@example.com" })
        const context = { mongo, user }
        const response = await resolvers.Query.userMembershipData(null, null, context)
        expect(response).toMatchObject({
          present: null,
          isMember: false,
          wasMember: true,
          alertLevel: 3,
          nextStart: moment(dateUtils.today).format("YYYY-MM-DD"),
          nextEnd: moment(dateUtils.inAYear).format("YYYY-MM-DD"),
          memberships: [membershipData[1], membershipData[0]],
        })
      })
    })
    describe("for user2@example.com", () => {
      it("returns the context user's membershipData", async () => {
        await mongo.loadUsers()
        await mongo.loadMemberships()
        const user = await mongo.Users.findOne({ email: "user2@example.com" })
        const context = { mongo, user }
        const response = await resolvers.Query.userMembershipData(null, null, context)
        expect(response).toMatchObject({
          present: membershipData[3],
          isMember: true,
          wasMember: true,
          alertLevel: 2,
          nextStart: moment
            .utc()
            .add(10, "d")
            .format("YYYY-MM-DD"),
          nextEnd: moment
            .utc()
            .add(1, "y")
            .add(9, "d")
            .format("YYYY-MM-DD"),
          memberships: [membershipData[3], membershipData[2]],
        })
      })
    })
  })
  describe("userMemberships", () => {
    it("returns the context user's memberships", async () => {
      await mongo.loadUsers()
      await mongo.loadMemberships()
      const user = await mongo.Users.findOne({ email: "user1@example.com" })
      const context = { mongo, user }
      const response = await resolvers.Query.userMemberships(null, null, context)
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
