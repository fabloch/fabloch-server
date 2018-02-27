import hasRole from "./hasRole"

describe("hasRole", () => {
  it("returns true if user has role", () => {
    const user = {
      roles: ["admin"],
    }
    expect(hasRole(user, "admin")).toBeTruthy()
  })
  it("returns false if user does not have role", () => {
    const user = {
      roles: ["clown"],
    }
    expect(hasRole(user, "admin")).toBeFalsy()
  })
})
