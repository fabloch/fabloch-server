import { ObjectId } from "mongodb"
import resolvers from "../resolvers"

describe("Newcomer Newcomer resolver", () => {
  it("returns id from _id", () => {
    const newcomer = {
      _id: ObjectId("5a343c2d9d29ab155b930b3f"),
    }
    expect(resolvers.Newcomer.id(newcomer)).toEqual("5a343c2d9d29ab155b930b3f")
  })
})
