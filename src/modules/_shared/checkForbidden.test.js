import checkForbidden from "./checkForbidden"

describe("checkForbidden", () => {
  it("returns the errors untouched if no forbidden field", () => {
    const field = "title"
    const object = { other: "alright" }
    let errors = []
    errors = checkForbidden([field], object, errors)
    expect(errors).toEqual([])
  })
  it("add to error array if forbiddden key", () => {
    const field = "title"
    const object = { title: "else" }
    let errors = []
    errors = checkForbidden([field], object, errors)
    expect(errors).toEqual([{
      key: "title",
      message: "Forbidden field: title.",
    }])
  })
  it("it splits camelcased keys", () => {
    const field = "camelCased"
    const object = { camelCased: "else" }
    let errors = []
    errors = checkForbidden([field], object, errors)
    expect(errors).toEqual([{
      key: "camelCased",
      message: "Forbidden field: camel cased.",
    }])
  })
  it("add to errors to array if keys missing", () => {
    const fields = ["title", "description"]
    const object = { title: "else", description: "else" }
    let errors = []
    errors = checkForbidden(fields, object, errors)
    expect(errors).toEqual([
      { key: "title", message: "Forbidden field: title." },
      { key: "description", message: "Forbidden field: description." },
    ])
  })
})
