import { ObjectId } from "mongodb"
import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { userData, eventTicketData } from "../../../testUtils/fixtures"

let mongo

describe("User User resolver", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("tickets", () => {
    it("returns user's tickets", async () => {
      await mongo.loadUsers()
      await mongo.loadEventTickets()
      const [user] = userData
      const context = { mongo, user }
      const response = await resolvers.User.tickets(user, null, context)
      expect(response).toMatchObject([eventTicketData[0]])
    })
  })
})
