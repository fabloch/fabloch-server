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

  describe("id attribute", () => {
    it("returns the _id stringified value", () => {
      const id = resolvers.Newcomer.id(newcomerData[0])
      expect(id).toEqual("5a4b76d5fdea180e9295743c")
    })
  })
})
