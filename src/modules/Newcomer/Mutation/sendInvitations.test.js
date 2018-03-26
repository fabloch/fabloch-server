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
        const context = { mongo, user }
        const newcomerIds = [newcomerData[0]._id.toString(), newcomerData[1]._id.toString()]
        const response = await resolvers.Mutation.sendInvitations(null, { newcomerIds }, context)
        expect(response).toMatchObject([
          { invitationSentCount: 2 },
          { invitationSentCount: 1 },
        ])
      })
      it("calls mailer with")
    })
    describe("error", () => {
      it("raises if no user in context", async () => {
        expect.assertions(2)
        await mongo.loadUsers()
        await mongo.loadNewcomers()
        const user = null
        const context = { mongo, user }
        const newcomerIds = [newcomerData[0]._id.toString(), newcomerData[1]._id.toString()]
        try {
          await resolvers.Mutation.sendInvitations(null, { newcomerIds }, context)
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
        const context = { mongo, user }
        const newcomerIds = [newcomerData[0]._id.toString(), newcomerData[1]._id.toString()]
        try {
          await resolvers.Mutation.sendInvitations(null, { newcomerIds }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ main: ["Not allowed."] })
        }
      })
    })
  })
})
