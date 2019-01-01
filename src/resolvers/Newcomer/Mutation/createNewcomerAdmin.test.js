import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, userData } from "../../../testUtils/fixtures"

let mongo

const mockMath = Object.create(global.Math)
mockMath.random = () => 0.55
global.Math = mockMath

describe("Newcomer Mutation resolvers", () => {
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

  describe("createNewcomerAdmin for Admin user", () => {
    describe("success", () => {
      it("creates newcomer with random url, name and guest flag", async () => {
        await mongo.loadUsers()
        await mongo.loadNewcomers()
        const context = { mongo, user: admin }
        const newcomerInput = { email: "new@example.com", fullName: "John Doe" }
        const response = await resolvers.Mutation.createNewcomerAdmin(
          null,
          { newcomerInput },
          context,
        )
        expect(response.email).toEqual("new@example.com")
        expect(response.token).toMatch(/ey.+/)
        expect(response.guest).toBeTruthy()
      })
    })
    describe("error", () => {
      it("raises an error if no user in context", async () => {
        expect.assertions(1)
        await mongo.loadUsers()
        await mongo.loadNewcomers()
        const user = null
        const context = { mongo, user }
        const newcomerInput = { email: "user1@example.com", fullName: "John Doe" }
        try {
          await resolvers.Mutation.createNewcomerAdmin(null, { newcomerInput }, context)
        } catch (e) {
          expect(e.message).toEqual("Not authenticated.")
        }
      })
      it("raises error if not admin", async () => {
        expect.assertions(1)
        await mongo.loadUsers()
        await mongo.loadNewcomers()
        const context = { mongo, user: userData[0] }
        const newcomerInput = { email: "user1@example.com", fullName: "John Doe" }
        try {
          await resolvers.Mutation.createNewcomerAdmin(null, { newcomerInput }, context)
        } catch (e) {
          expect(e.message).toEqual("Not authenticated as admin.")
        }
      })
      it("raises an error if email already exists in Users", async () => {
        expect.assertions(2)
        await mongo.loadUsers()
        const context = { mongo, user: admin }
        const newcomerInput = { email: "user1@example.com" }
        try {
          await resolvers.Mutation.createNewcomerAdmin(null, { newcomerInput }, context)
        } catch (e) {
          expect(e.message).toEqual("Failed to save newcomer.")
          expect(e.validationErrors).toEqual({ email: ["A user already exists with this email."] })
        }
      })
      it("raises an error if email already exists in Newcomers", async () => {
        expect.assertions(2)
        await mongo.loadNewcomers()
        const context = { mongo, user: admin }
        const newcomerInput = { email: "user3@example.com" }
        try {
          await resolvers.Mutation.createNewcomerAdmin(null, { newcomerInput }, context)
        } catch (e) {
          expect(e.message).toEqual("Failed to save newcomer.")
          expect(e.validationErrors).toEqual({
            email: ["A newcomer already exists with this email."],
          })
        }
      })
    })
  })
})
