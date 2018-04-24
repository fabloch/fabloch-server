import checkUrls from "./checkUrls"

describe("checkUrls", () => {
  it("returns empty errors if valid urls", () => {
    const errors = []
    const object = {
      facebookUrl: "http://www.facebook.com/something",
      twitterUrl: "https://www.twitter.com/something",
      anotherUrl: "http://youtu.be/something",
    }
    const fields = ["facebookUrl", "twitterUrl", "anotherUrl"]
    expect(checkUrls(errors, object, fields)).toEqual([])
  })
  it("pushes an error in errors array if invalid url", () => {
    const errors = []
    const object = {
      facebookUrl: "http://www.facebook.com/something",
      twitterUrl: "https://www.twitter.com/something",
      wrongUrl: "wrong url",
    }
    const fields = ["facebookUrl", "twitterUrl", "wrongUrl"]
    expect(checkUrls(errors, object, fields))
      .toEqual([{ key: "wrongUrl", message: "Invalid url." }])
  })
  it("does not raise if field is an empty string", () => {
    let errors = []
    const object = {
      facebookUrl: "http://www.facebook.com/something",
      twitterUrl: "https://www.twitter.com/something",
      anotherUrl: "",
    }
    const fields = ["facebookUrl", "twitterUrl", "anotherUrl"]
    checkUrls(errors, object, fields)
    expect(errors).toEqual([])
  })
  it("does not raise if field is not an object attribute", () => {
    const errors = []
    const object = {
      facebookUrl: "http://www.facebook.com/something",
      twitterUrl: "https://www.twitter.com/something",
    }
    const fields = ["facebookUrl", "twitterUrl", "anotherUrl"]
    checkUrls(errors, object, fields)
  })
})
