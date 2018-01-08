import { ObjectId } from "mongodb"
import resolvers from "./resolvers"
import connectMongo from "../../testUtils/mongoTest"
import { dateUtils } from "../../testUtils/fixtures"

let mongo

describe("Membership Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("createMembership", () => {
    it("creates membership when ctx user & no overlapping membership", async () => {
      await mongo.loadUsers()
      const user = await mongo.Users.findOne({ email: "user1@example.com" })
      const context = { mongo, user }
      const membership = {
        plan: "PERSO",
        start: dateUtils.today,
        end: dateUtils.inAYear,
      }
      const response = await resolvers.Mutation.createMembership(null, { membership }, context)
      expect(response).toMatchObject({
        plan: "PERSO",
        start: dateUtils.today,
        end: dateUtils.inAYear,
        ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
      })
    })
    it("raises error if no ctx user", async () => {
      await mongo.loadUsers()
      const user = null
      const context = { mongo, user }
      const membership = {
        plan: "PERSO",
        start: dateUtils.today,
        end: dateUtils.inAYear,
      }
      try {
        await resolvers.Mutation.createMembership(null, { membership }, context)
      } catch (e) {
        expect(e.message).toEqual("Unauthenticated.")
      }
    })
    it("raises error if overlapping membership", async () => {
      await mongo.loadUsers()
      await mongo.loadMemberships()
      const user = await mongo.Users.findOne({ email: "user2@example.com" })
      const context = { mongo, user }
      const membership = {
        plan: "PERSO",
        start: dateUtils.today,
        end: dateUtils.inAYear,
      }
      try {
        await resolvers.Mutation.createMembership(null, { membership }, context)
      } catch (e) {
        expect(e.message).toEqual("Previous membership overlapping (ending in 9 days).")
      }
    })
  })
})
