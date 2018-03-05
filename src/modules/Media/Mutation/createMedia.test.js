import { ObjectId } from "mongodb"
import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, eventSessionData, mediaData } from "../../../testUtils/fixtures"

let mongo

describe("createMedia", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("creation", async () => {
    it("creates an IMAGE media", async () => {
      await mongo.loadUsers()
      const user = admin
      const context = { mongo, user }
      const mediaInput = {
        category: "IMAGE",
        parentId: eventSessionData[0]._id.toString(),
        parentCollection: "EventSessions",
        rank: 1,
        picUrl: "http://www.url.com/",
      }
      const response = await resolvers.Mutation.createMedia(null, { mediaInput }, context)
      expect(response).toMatchObject({ ...mediaInput, parentId: eventSessionData[0]._id })
    })
    it("creates an LINK media", async () => {
      await mongo.loadUsers()
      const user = admin
      const context = { mongo, user }
      const mediaInput = {
        category: "LINK",
        parentId: eventSessionData[0]._id.toString(),
        parentCollection: "EventSessions",
        rank: 1,
        sourceUrl: "http://www.url.com/",
      }
      const response = await resolvers.Mutation.createMedia(null, { mediaInput }, context)
      expect(response).toMatchObject(mediaInput)
    })
  })
  describe("Errors", () => {
    it("raises an error if no user in context", async () => {
      expect.assertions(2)
      const user = null
      const context = { mongo, user }
      const mediaInput = {}
      try {
        await resolvers.Mutation.createMedia(null, { mediaInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["Unauthenticated."] })
      }
    })
    it("raises if no category", async () => {
      expect.assertions(2)
      const user = admin
      const context = { mongo, user }
      const mediaInput = {
        parentId: eventSessionData[0]._id.toString(),
        parentCollection: "EventSessions",
        rank: 1,
      }
      try {
        await resolvers.Mutation.createMedia(null, { mediaInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({
          category: ["Missing category."],
        })
      }
    })
    it("raises if no parentId", async () => {
      expect.assertions(2)
      const user = admin
      const context = { mongo, user }
      const mediaInput = {
        category: "IMAGE",
        parentCollection: "EventSessions",
        rank: 1,
      }
      try {
        await resolvers.Mutation.createMedia(null, { mediaInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({
          parentId: ["Missing parent id."],
        })
      }
    })
    it("raises if no parentCollection", async () => {
      expect.assertions(2)
      const user = admin
      const context = { mongo, user }
      const mediaInput = {
        category: "IMAGE",
        parentId: eventSessionData[0]._id.toString(),
        rank: 1,
      }
      try {
        await resolvers.Mutation.createMedia(null, { mediaInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({
          parentCollection: ["Missing parent collection."],
        })
      }
    })
    it("raises if IMAGE and no picUrl", async () => {
      expect.assertions(2)
      const user = admin
      const context = { mongo, user }
      const mediaInput = {
        category: "IMAGE",
        parentId: eventSessionData[0]._id.toString(),
        parentCollection: "EventSessions",
        rank: 1,
      }
      try {
        await resolvers.Mutation.createMedia(null, { mediaInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({
          picUrl: ["Missing pic url."],
        })
      }
    })
    it("raises if LINK and no sourceUrl", async () => {
      expect.assertions(2)
      const user = admin
      const context = { mongo, user }
      const mediaInput = {
        category: "LINK",
        parentId: eventSessionData[0]._id.toString(),
        parentCollection: "EventSessions",
        rank: 1,
      }
      try {
        await resolvers.Mutation.createMedia(null, { mediaInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({
          sourceUrl: ["Missing source url."],
        })
      }
    })
  })
})
