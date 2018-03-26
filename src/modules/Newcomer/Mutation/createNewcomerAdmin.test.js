import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, userData } from "../../../testUtils/fixtures"

let mongo

const mockMath = Object.create(global.Math)
mockMath.random = () => 0.55
global.Math = mockMath

describe("Newcomer Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("createNewcomerAdmin for Admin user", () => {
    describe("success", () => {
      it("creates newcomer with random url, name and guest flag", async () => {
        await mongo.loadUsers()
        await mongo.loadNewcomers()
        const user = admin
        const context = { mongo, user }
        const newcomerInput = { email: "new@example.com", fullName: "John Doe" }
        const response = await resolvers.Mutation
          .createNewcomerAdmin(null, { newcomerInput }, context)
        expect(response.email).toEqual("new@example.com")
        expect(response.token).toMatch(/ey.+/)
        expect(response.guest).toBeTruthy()
      })
    })
    describe("error", () => {
      it("raises an error if no user in context", async () => {
        expect.assertions(2)
        await mongo.loadUsers()
        await mongo.loadNewcomers()
        const user = null
        const context = { mongo, user }
        const newcomerInput = { email: "user1@example.com", fullName: "John Doe" }
        try {
          await resolvers.Mutation.createNewcomerAdmin(null, { newcomerInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ main: ["Unauthenticated."] })
        }
      })
      it("raises error if not admin", async () => {
        expect.assertions(2)
        await mongo.loadUsers()
        await mongo.loadNewcomers()
        const user = userData[0]
        const context = { mongo, user }
        const newcomerInput = { email: "user1@example.com", fullName: "John Doe" }
        try {
          await resolvers.Mutation.createNewcomerAdmin(null, { newcomerInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ main: ["Not allowed."] })
        }
      })
    })
  })
})
