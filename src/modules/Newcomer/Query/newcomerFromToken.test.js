import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import mailer from "../../../mailer"

let mongo

const mockMath = Object.create(global.Math)
mockMath.random = () => 0.55
global.Math = mockMath

describe("Newcomer Query resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("newcomerFromToken", () => {
    it("returns newcomer5 from token", async () => {
      await mongo.loadNewcomers()
      const context = { mongo, mailer }
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXI1QGV4YW1wbGUuY29tIiwiaWF0IjoxNTIyMTQ4MDA3fQ.tO61ImDbURBg04MaWb4bR1LgJCgSY01dzZIDmVU2W4M"
      const response = await resolvers.Query.newcomerFromToken(null, { token }, context)
      expect(response.email).toEqual("user5@example.com")
      expect(response.fullName).toEqual("User Five")
      expect(response.guest).toBeTruthy()
    })
    it("returns newcomer3 from token", async () => {
      await mongo.loadNewcomers()
      const context = { mongo, mailer }
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXI2QGV4YW1wbGUuY29tIiwiaWF0IjoxNTIyMTQ4MDcxfQ.Fz54JRAhpz7C5HFwnQDITWh0qPGK7-p9dvihFHCN5nI"
      const response = await resolvers.Query.newcomerFromToken(null, { token }, context)
      expect(response.email).toEqual("user6@example.com")
      expect(response.fullName).toEqual("User Six")
      expect(response.guest).toBeTruthy()
    })
    it("raises if wrong token", async () => {
      await mongo.loadNewcomers()
      const context = { mongo, mailer }
      const token = "wrongeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXI2QGV4YW1wbGUuY29tIiwiaWF0IjoxNTIyMTQ4MDcxfQ.Fz54JRAhpz7C5HFwnQDITWh0qPGK7-p9dvihFHCN5nI"
      try {
        await resolvers.Query.newcomerFromToken(null, { token }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Invalid token."] })
      }
    })
  })
})
