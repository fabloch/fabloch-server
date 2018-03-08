import { ObjectId } from "mongodb"
import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"
import { admin, eventModelData, eventSessionData, mediaData } from "../../../testUtils/fixtures"

let mongo

describe("saveMedia", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("create", async () => {
    it("creates an IMAGE media", async () => {
      const user = admin
      const context = { mongo, user }
      const mediaInput = {
        category: "IMAGE",
        parentId: eventSessionData[0]._id.toString(),
        parentCollection: "EventSessions",
        rank: 0,
        picUrl: "http://www.url.com/",
      }
      const response = await resolvers.Mutation.saveMedia(null, { mediaInput }, context)
      expect(response).toMatchObject({ ...mediaInput, parentId: eventSessionData[0]._id })
    })
    it("creates an LINK media", async () => {
      const user = admin
      const context = { mongo, user }
      const mediaInput = {
        category: "LINK",
        parentId: eventSessionData[0]._id.toString(),
        parentCollection: "EventSessions",
        rank: 0,
        sourceUrl: "http://www.url.com/",
      }
      const response = await resolvers.Mutation.saveMedia(null, { mediaInput }, context)
      expect(response).toMatchObject({ ...mediaInput, parentId: eventSessionData[0]._id })
    })
  })
  describe("update", () => {
    it("updates picUrl", async () => {
      await mongo.loadMedias()
      const user = admin
      const context = { mongo, user }
      const mediaInput = {
        id: mediaData[0]._id.toString(),
        picUrl: "http://www.new-url.com/",
      }
      const response = await resolvers.Mutation.saveMedia(null, { mediaInput }, context)
      expect(response).toMatchObject({
        parentId: eventModelData[0]._id,
        picUrl: "http://www.new-url.com/",
      })
    })
    it("updates rank", async () => {
      await mongo.loadMedias()
      const user = admin
      const context = { mongo, user }
      const mediaInput = {
        id: mediaData[0]._id.toString(),
        rank: 2,
      }
      const response = await resolvers.Mutation.saveMedia(null, { mediaInput }, context)
      expect(response).toMatchObject({
        rank: 2,
        parentId: eventModelData[0]._id,
        title: mediaData[0].title,
      })
    })
  })
  describe("Errors", () => {
    it("raises an error if no user in context", async () => {
      expect.assertions(2)
      const user = null
      const context = { mongo, user }
      const mediaInput = {}
      try {
        await resolvers.Mutation.saveMedia(null, { mediaInput }, context)
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
        rank: 0,
      }
      try {
        await resolvers.Mutation.saveMedia(null, { mediaInput }, context)
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
        rank: 0,
      }
      try {
        await resolvers.Mutation.saveMedia(null, { mediaInput }, context)
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
        rank: 0,
      }
      try {
        await resolvers.Mutation.saveMedia(null, { mediaInput }, context)
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
        rank: 0,
      }
      try {
        await resolvers.Mutation.saveMedia(null, { mediaInput }, context)
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
        rank: 0,
      }
      try {
        await resolvers.Mutation.saveMedia(null, { mediaInput }, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({
          sourceUrl: ["Missing source url."],
        })
      }
    })
  })
})
