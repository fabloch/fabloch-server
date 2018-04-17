import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { userData } from "../../../testUtils/fixtures"

let mongo

describe("User Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("updateProfile", () => {
    describe("success", () => {
      it("updates the fullName", async () => {
        await mongo.loadUsers()
        const [user] = userData
        const context = { mongo, user }
        const profileInput = {
          fullName: "John Doe",
        }
        const response = await resolvers.Mutation.updateProfile(null, { profileInput }, context)
        expect(response).toMatchObject({
          profile: profileInput,
        })
      })
      it("updates the picUrl", async () => {
        await mongo.loadUsers()
        const [user] = userData
        const context = { mongo, user }
        const profileInput = {
          picUrl: "http://www.google.com/image.jpg",
        }
        const response = await resolvers.Mutation.updateProfile(null, { profileInput }, context)
        expect(response).toMatchObject({
          profile: profileInput,
        })
      })
      it("updates the intro", async () => {
        await mongo.loadUsers()
        const [user] = userData
        const context = { mongo, user }
        const profileInput = {
          intro: "Tantum autem cuique tribuendum, \nprimum quantum ipse\nefficere possis.",
        }
        const response = await resolvers.Mutation.updateProfile(null, { profileInput }, context)
        expect(response).toMatchObject({
          profile: profileInput,
        })
      })
      it("updates facebookUrl, githubUrl, linkedInUrl, otherUrl", async () => {
        await mongo.loadUsers()
        const [user] = userData
        const context = { mongo, user }
        const profileInput = {
          facebookUrl: "https://www.facebook.com/s.nicolaidis",
          twitterUrl: "https://www.twitter.com/s.nicolaidis",
          githubUrl: "https://www.github.com/sebabouche",
          linkedInUrl: "https://www.linkedin.com/s.nicolaidis",
          otherUrl: "https://www.google.com",
        }
        const response = await resolvers.Mutation.updateProfile(null, { profileInput }, context)
        expect(response).toMatchObject({
          profile: profileInput,
        })
      })
    })
    describe("errors", () => {
      it("raises with no context user", async () => {
        await mongo.loadUsers()
        const user = null
        const profileInput = { email: "another@email.com" }
        const context = { mongo, user }
        try {
          await resolvers.Mutation.updateProfile(null, { profileInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ main: ["Unauthenticated."] })
        }
      })
      it("raises with fullName empty", async () => {
        expect.assertions(2)
        await mongo.loadUsers()
        const [user] = userData
        const context = { mongo, user }
        const profileInput = {
          fullName: "",
        }
        try {
          await resolvers.Mutation.updateProfile(null, { profileInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ fullName: ["Can't be empty."] })
        }
      })
      it("raises with intro empty", async () => {
        expect.assertions(2)
        await mongo.loadUsers()
        const [user] = userData
        const context = { mongo, user }
        const profileInput = {
          intro: "",
        }
        try {
          await resolvers.Mutation.updateProfile(null, { profileInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ intro: ["Can't be empty."] })
        }
      })
      it("raises with profilePic empty", async () => {
        expect.assertions(2)
        await mongo.loadUsers()
        const [user] = userData
        const context = { mongo, user }
        const profileInput = {
          profilePic: "",
        }
        try {
          await resolvers.Mutation.updateProfile(null, { profileInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ profilePic: ["Can't be empty."] })
        }
      })
      it("raises with facebookUrl and wrong url", async () => {
        expect.assertions(2)
        await mongo.loadUsers()
        const [user] = userData
        const context = { mongo, user }
        const profileInput = {
          facebookUrl: "wrong url",
        }
        try {
          await resolvers.Mutation.updateProfile(null, { profileInput }, context)
        } catch (e) {
          expect(e.message).toEqual("The request is invalid.")
          expect(e.state).toEqual({ facebookUrl: ["Invalid url."] })
        }
      })
    })
  })
})
