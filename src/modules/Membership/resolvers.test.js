import { ObjectId } from "mongodb"
import resolvers from "./resolvers"
import connectMongo from "../../testUtils/mongoTest"
import { userData, membershipData } from "../../testUtils/fixtures"

let mongo

describe("Membership resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(() => mongo.afterEach())
  afterAll(() => { mongo.tearDown() })

  describe("Query", () => {
    describe("userMemberships", () => {
      it("returns the context user's memberships", async () => {
        await mongo.loadUsers()
        await mongo.loadMemberships()
        const user = await mongo.Users.findOne({ email: "user1@example.com" })
        const context = { mongo, user }
        const response = await resolvers.Query.userMemberships(null, null, context)
        expect(response).toEqual(membershipData)
      })
    })
  })
  describe("Mutation", () => {
    describe("createMembership", () => {
      it("creates membership when ctx user & no overlapping membership", async () => {
        await mongo.loadUsers()
        const user = await mongo.Users.findOne({ email: "user1@example.com" })
        const context = { mongo, user }
        const membership = {
          plan: "PERSO",
          startDate: "2016-12-18T00:00:00.000Z",
          endDate: "2017-12-17T00:00:00.000Z",
        }
        const response = await resolvers.Mutation.createMembership(null, { membership }, context)
        expect(response).toMatchObject({
          plan: "PERSO",
          startDate: "2016-12-18T00:00:00.000Z",
          endDate: "2017-12-17T00:00:00.000Z",
          ownerId: ObjectId("5a31b456c5e7b54a9aba3782"),
        })
      })
      it("raises error if no ctx user", async () => {
        await mongo.loadUsers()
        const user = null
        const context = { mongo, user }
        const membership = {
          plan: "PERSO",
          startDate: "2016-12-18T00:00:00.000Z",
          endDate: "2017-12-17T00:00:00.000Z",
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
        const user = await mongo.Users.findOne({ email: "user1@example.com" })
        const context = { mongo, user }
        const membership = {
          plan: "PERSO",
          startDate: "2016-12-18T00:00:00.000Z",
          endDate: "2017-12-17T00:00:00.000Z",
        }
        try {
          await resolvers.Mutation.createMembership(null, { membership }, context)
        } catch (e) {
          expect(e.message).toEqual("Previous membership overlapping (ending 2017-12-17T00:00:00.000Z).")
        }
      })
    })
  })
  describe("Membership", () => {
    describe("id", () => {
      it("returns the id stringified", () => {
        expect(resolvers.Membership.id(membershipData[0])).toEqual("5a383f36d2834c317755ab17")
      })
      it("returns the owner", async () => {
        await mongo.loadUsers()
        const context = { mongo }
        const response = await resolvers.Membership.owner(membershipData[0], null, context)
        expect(response).toEqual(userData[0])
      })
    })
  })
})
