import { ObjectId } from "mongodb"
import resolvers from "../"

describe("Media Media resolver", () => {
  it("returns id from _id", () => {
    const media = {
      _id: ObjectId("5a343c2d9d29ab155b930b3f"),
    }
    expect(resolvers.Media.id(media)).toEqual("5a343c2d9d29ab155b930b3f")
  })
})
