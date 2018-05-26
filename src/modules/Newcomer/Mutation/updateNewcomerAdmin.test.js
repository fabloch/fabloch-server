import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, userData, newcomerData } from "../../../testUtils/fixtures"

let mongo

const mockMath = Object.create(global.Math)
mockMath.random = () => 0.55
global.Math = mockMath

describe("Newcomer Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("updateNewcomerAdmin", () => {
    describe("positive", () => {
      it("updates newcomer email", async () => {
        await mongo.loadNewcomers()
        const context = { mongo, user: admin }
        const newcomerInput = { id: newcomerData[0]._id.toString(), email: "new-email@example.com" }
        const response = await resolvers.Mutation
          .updateNewcomerAdmin(null, { newcomerInput }, context)
        expect(response.email).toEqual("new-email@example.com")
      })
      it("updates newcomer fullName", async () => {
        await mongo.loadNewcomers()
        const context = { mongo, user: admin }
        const newcomerInput = { id: newcomerData[0]._id.toString(), fullName: "New Name" }
        const response = await resolvers.Mutation
          .updateNewcomerAdmin(null, { newcomerInput }, context)
        expect(response.fullName).toEqual("New Name")
      })
    })
    describe("negative", () => {
      it("raises if not authenticated", async () => {
        expect.assertions(2)
        const context = { mongo }
        const newcomerInput = { id: newcomerData[0]._id.toString(), email: "" }
        try {
          await resolvers.Mutation.updateNewcomerAdmin(null, { newcomerInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ main: ["Unauthenticated."] })
        }
      })
      it("raises if not admin", async () => {
        expect.assertions(2)
        const context = { mongo, user: userData[0] }
        const newcomerInput = { id: newcomerData[0]._id.toString(), email: "" }
        try {
          await resolvers.Mutation.updateNewcomerAdmin(null, { newcomerInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ main: ["Not allowed."] })
        }
      })
      it("raises an error if invalid email", async () => {
        expect.assertions(2)
        await mongo.loadNewcomers()
        await mongo.loadUsers()
        const context = { mongo, user: admin }
        const newcomerInput = { id: newcomerData[0]._id.toString(), email: "wrongEmail" }
        try {
          await resolvers.Mutation.updateNewcomerAdmin(null, { newcomerInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ email: ["Invalid email."] })
        }
      })
      it("raises an error if email already exists in Newcomers", async () => {
        expect.assertions(2)
        await mongo.loadNewcomers()
        await mongo.loadUsers()
        const context = { mongo, user: admin }
        const newcomerInput = { id: newcomerData[0]._id.toString(), email: "user4@example.com" }
        try {
          await resolvers.Mutation.updateNewcomerAdmin(null, { newcomerInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ email: ["A newcomer exists with this email."] })
        }
      })
      it("raises an error if email already exists in Users", async () => {
        expect.assertions(2)
        await mongo.loadNewcomers()
        await mongo.loadUsers()
        const context = { mongo, user: admin }
        const newcomerInput = { id: newcomerData[0]._id.toString(), email: "user1@example.com" }
        try {
          await resolvers.Mutation.updateNewcomerAdmin(null, { newcomerInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ email: ["A user already exists with this email."] })
        }
      })
    })
  })
})
