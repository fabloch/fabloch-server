import resolvers from "./resolvers"
import connectMongo from "../../testUtils/mongoTest"
import { newcomerData } from "../../testUtils/fixtures"

let mongo

const mockMath = Object.create(global.Math)
mockMath.random = () => 0.55
global.Math = mockMath

describe("Newcomer Newcomer resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("valid attribute", () => {
    it("returns true if true", () => {
      const valid = resolvers.Newcomer.valid(newcomerData[0])
      expect(valid).toEqual(true)
    })
    it("returns false if no value", () => {
      const valid = resolvers.Newcomer.valid(newcomerData[1])
      expect(valid).toEqual(false)
    })
  })
})
