import resolvers from "../"
import { eventModelData } from "../../../testUtils/fixtures"

describe("titleAny", () => {
  it("returns the title", () => {
    expect(resolvers.EventModel.titleAny(eventModelData[0])).toEqual(eventModelData[0].title)
  })
})
