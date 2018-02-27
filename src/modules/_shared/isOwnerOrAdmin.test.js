import { ObjectId } from "mongodb"
import isOwnerOrAdmin from "./isOwnerOrAdmin"

describe("isOwnerOrAdmin", () => {
  it("returns true is user owns the object", () => {
    const user = {
      _id: ObjectId("5a4a5eb6404da6d636078beb"),
    }
    const object = {
      ownerId: ObjectId("5a4a5eb6404da6d636078beb"),
    }
    expect(isOwnerOrAdmin(object, user)).toBeTruthy()
  })
  it("returns false is user does not own the object", () => {
    const user = {
      _id: ObjectId("5a4a5eb6404da6d636078bef"),
    }
    const object = {
      ownerId: ObjectId("5a4a5eb6404da6d636078beb"),
    }
    expect(isOwnerOrAdmin(object, user)).toBeFalsy()
  })
  it("returns true is the user is admin", () => {
    const user = {
      roles: ["admin"],
    }
    const object = {
      ownerId: ObjectId("5a4a5eb6404da6d636078beb"),
    }
    expect(isOwnerOrAdmin(object, user)).toBeTruthy()
  })
})
