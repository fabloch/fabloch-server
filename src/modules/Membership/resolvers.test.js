import { ObjectId } from "mongodb"
import moment from "moment"
import resolvers from "./resolvers"
import connectMongo from "../../testUtils/mongoTest"
import { userData, membershipData, dateUtils } from "../../testUtils/fixtures"

let mongo

describe("Membership resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("Query", () => {
    // describe("userMembershipData", () => {
    //   it("returns the context user's membershipData", async () => {
    //     await mongo.loadUsers()
    //     await mongo.loadMemberships()
    //     const user = await mongo.Users.findOne({ email: "user1@example.com" })
    //     const context = { mongo, user }
    //     const response = await resolvers.Query.userMemberships(null, null, context)
    //     expect(response).toMatchObject([])
    //   })
    // })
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
  describe("Mutation", () => {
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
          expect(e.message).toEqual("Previous membership overlapping (ending in 10 days).")
        }
      })
    })
  })
  describe("Membership", () => {
    describe("id", () => {
      it("returns the id stringified", () => {
        expect(resolvers.Membership.id(membershipData[0])).toEqual("5a383f36d2834c317755ab17")
      })
    })
    describe("start, end", () => {
      it("returns a date string from datetime", () => {
        expect(resolvers.Membership.start(membershipData[0]))
          .toEqual(moment(dateUtils.user1membership1Start).format("YYYY-MM-DD"))
        expect(resolvers.Membership.end(membershipData[0]))
          .toEqual(moment(dateUtils.user1membership1End).format("YYYY-MM-DD"))
      })
    })
    describe("owner", () => {
      it("returns the owner", async () => {
        await mongo.loadUsers()
        const context = { mongo }
        const response = await resolvers.Membership.owner(membershipData[0], null, context)
        expect(response).toEqual(userData[0])
      })
    })
  })
})
