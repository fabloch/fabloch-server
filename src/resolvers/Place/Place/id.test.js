import { ObjectId } from "mongodb"
import resolvers from "../"

describe("Place Place resolver", () => {
  it("returns id from _id", () => {
    const place = {
      _id: ObjectId("5a343c2d9d29ab155b930b3f"),
    }
    expect(resolvers.Place.id(place)).toEqual("5a343c2d9d29ab155b930b3f")
  })
})
