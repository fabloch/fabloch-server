import { ObjectId } from "mongodb"
import resolvers from "../resolvers"

describe("User User resolver", () => {
  it("returns id from _id", () => {
    const user = {
      _id: ObjectId("5a343c2d9d29ab155b930b3f"),
      body: "Lorem Ipsum",
    }
    expect(resolvers.User.id(user)).toEqual("5a343c2d9d29ab155b930b3f")
  })
})
