import checkMissing from "./checkMissing"

describe("checkMissing", () => {
  it("returns the errors untouched if field not missing", () => {
    const field = "title"
    const object = { title: "alright" }
    let errors = []
    errors = checkMissing([field], object, errors)
    expect(errors).toEqual([])
  })
  it("add to error array if key missing", () => {
    const field = "title"
    const object = { anything: "else" }
    let errors = []
    errors = checkMissing([field], object, errors)
    expect(errors).toEqual([{
      key: "title",
      message: "Missing title.",
    }])
  })
  it("it splits camelcased keys", () => {
    const field = "camelCased"
    const object = { anything: "else" }
    let errors = []
    errors = checkMissing([field], object, errors)
    expect(errors).toEqual([{
      key: "camelCased",
      message: "Missing camel cased.",
    }])
  })
  it("add to errors to array if keys missing", () => {
    const fields = ["title", "description"]
    const object = { anything: "else" }
    let errors = []
    errors = checkMissing(fields, object, errors)
    expect(errors).toEqual([
      { key: "title", message: "Missing title." },
      { key: "description", message: "Missing description." },
    ])
  })
})
