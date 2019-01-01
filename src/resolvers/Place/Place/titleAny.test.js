import resolvers from "../"
import { placeData } from "../../../testUtils/fixtures"

describe("titleAny", () => {
  it("returns the title", () => {
    expect(resolvers.Place.titleAny(placeData[0])).toEqual(placeData[0].title)
  })
})
