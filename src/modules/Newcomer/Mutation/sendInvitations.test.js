import moment from "moment"
import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, newcomerData, userData } from "../../../testUtils/fixtures"
import mailer from "../../../mailer"

let mongo

const mockMath = Object.create(global.Math)
mockMath.random = () => 0.55
global.Math = mockMath

describe("Newcomer Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("sendInvitations", () => {
    describe("success", () => {
      it("increments invitationSent and invitationSentAt", async () => {
        await mongo.loadUsers()
        await mongo.loadNewcomers()
        const user = admin
        const context = { mongo, user, mailer }
        const invitationInput = {
          newcomerIds: [newcomerData[2]._id.toString(), newcomerData[3]._id.toString()],
          message: "A custom message",
        }
        const response = await resolvers.Mutation
          .sendInvitations(null, { invitationInput }, context)
        expect(response).toMatchObject([{ invitationSentCount: 2 }, { invitationSentCount: 1 }])
        expect(moment(response[0].invitationSentAt).format("LL")).toMatch(moment().utc().format("LL"))
        expect(moment(response[1].invitationSentAt).format("LL")).toMatch(moment().utc().format("LL"))
      })
      it("sends email with message for each newcomer", async () => {
        await mongo.loadUsers()
        await mongo.loadNewcomers()
        const user = admin
        const context = { mongo, user, mailer }
        const invitationInput = {
          newcomerIds: [newcomerData[2]._id.toString(), newcomerData[3]._id.toString()],
          message: "A custom message",
        }
        const response = await resolvers.Mutation
          .sendInvitations(null, { invitationInput }, context)
        expect(response).toMatchObject([{ invitationSentCount: 2 }, { invitationSentCount: 1 }])
        expect(moment(response[0].invitationSentAt).format("LL")).toMatch(moment().utc().format("LL"))
        expect(moment(response[1].invitationSentAt).format("LL")).toMatch(moment().utc().format("LL"))
      })
    })
    describe("error", () => {
      it("raises if no user in context", async () => {
        expect.assertions(2)
        await mongo.loadUsers()
        await mongo.loadNewcomers()
        const user = null
        const context = { mongo, user, mailer }
        const invitationInput = {
          newcomerIds: [newcomerData[2]._id.toString(), newcomerData[3]._id.toString()],
          message: "A custom message",
        }
        try {
          await resolvers.Mutation.sendInvitations(null, { invitationInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ main: ["Unauthenticated."] })
        }
      })
      it("raises if not admin", async () => {
        expect.assertions(2)
        await mongo.loadUsers()
        await mongo.loadNewcomers()
        const user = userData[0]
        const context = { mongo, user, mailer }
        const invitationInput = {
          newcomerIds: [newcomerData[2]._id.toString(), newcomerData[3]._id.toString()],
          message: "A custom message",
        }
        try {
          await resolvers.Mutation.sendInvitations(null, { invitationInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ main: ["Not allowed."] })
        }
      })
    })
  })
})
