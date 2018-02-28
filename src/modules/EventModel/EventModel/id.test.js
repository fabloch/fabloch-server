import resolvers from "../resolvers"
import { eventModelData } from "../../../testUtils/fixtures"

describe("EventModel EventModel resolvers", () => {
  describe("id", () => {
    it("returns _id from db", () => {
      expect(resolvers.EventModel.id(eventModelData[0])).toEqual("5a4a5eb6404da6d636078beb")
    })
  })
})
