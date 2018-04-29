import resolvers from "../resolvers"
import { eventModelData } from "../../../testUtils/fixtures"

describe("descriptionAny", () => {
  it("returns the description", () => {
    expect(resolvers.EventModel.descriptionAny(eventModelData[0]))
      .toEqual(eventModelData[0].description)
  })
})
