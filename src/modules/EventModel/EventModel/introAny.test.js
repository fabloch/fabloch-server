import resolvers from "../resolvers"
import { eventModelData } from "../../../testUtils/fixtures"

describe("introAny", () => {
  it("returns the intro", () => {
    expect(resolvers.EventModel.introAny(eventModelData[0])).toEqual(eventModelData[0].intro)
  })
})
