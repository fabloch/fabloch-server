import resolvers from "../"
import connectMongo from "../../../testUtils/mongoTest"
import {
  admin,
  eventModelData,
  eventSessionData,
  mediaData,
  userData,
} from "../../../testUtils/fixtures"

let mongo

describe("saveMedia", () => {
  beforeAll(async () => {
    mongo = await connectMongo()
  })
  beforeEach(async () => {
    await mongo.beforeEach()
  })
  afterEach(async () => {
    await mongo.afterEach()
  })
  afterAll(async () => {
    await mongo.afterAll()
  })

  describe("create", () => {
    it("creates an IMAGE media", async () => {
      const user = admin
      const context = { mongo, user }
      const mediaInput = {
        category: "IMAGE",
        parentId: eventSessionData[0]._id.toString(),
        parentCollection: "EventSessions",
        rank: "0",
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
        rank: "0",
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
        category: "IMAGE",
        parentId: eventModelData[0]._id.toString(),
        parentCollection: "EventSessions",
        rank: "0",
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
        category: "IMAGE",
        parentId: eventModelData[0]._id.toString(),
        parentCollection: "EventSessions",
        rank: "2",
        picUrl: "http://www.new-url.com/",
      }
      const response = await resolvers.Mutation.saveMedia(null, { mediaInput }, context)
      expect(response).toMatchObject({
        rank: "2",
        parentId: eventModelData[0]._id,
        title: mediaData[0].title,
      })
    })
  })
  describe("Errors", () => {
    it("raises an error if no user in context", async () => {
      expect.assertions(1)
      const user = null
      const context = { mongo, user }
      const mediaInput = {}
      try {
        await resolvers.Mutation.saveMedia(null, { mediaInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated.")
      }
    })
    it("raises an error if not owner or admin", async () => {
      expect.assertions(1)
      const user = userData[1]
      const context = { mongo, user }
      const mediaInput = {}
      try {
        await resolvers.Mutation.saveMedia(null, { mediaInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Not authenticated as admin.")
      }
    })
    it("raises if no category", async () => {
      expect.assertions(2)
      const user = admin
      const context = { mongo, user }
      const mediaInput = {
        parentId: eventSessionData[0]._id.toString(),
        parentCollection: "EventSessions",
        rank: "0",
      }
      try {
        await resolvers.Mutation.saveMedia(null, { mediaInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to update event session.")
        expect(e.validationErrors).toEqual({
          category: ["Category is missing."],
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
        picUrl: "someUrl",
        rank: "0",
      }
      try {
        await resolvers.Mutation.saveMedia(null, { mediaInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to update event session.")
        expect(e.validationErrors).toEqual({
          parentId: ["Parent Id is missing."],
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
        picUrl: "someUrl",
        rank: "0",
      }
      try {
        await resolvers.Mutation.saveMedia(null, { mediaInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to update event session.")
        expect(e.validationErrors).toEqual({
          parentCollection: ["Parent Collection is missing."],
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
        rank: "0",
      }
      try {
        await resolvers.Mutation.saveMedia(null, { mediaInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to update event session.")
        expect(e.validationErrors).toEqual({
          picUrl: ["Pic Url is missing."],
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
        rank: "0",
      }
      try {
        await resolvers.Mutation.saveMedia(null, { mediaInput }, context)
      } catch (e) {
        expect(e.message).toEqual("Failed to update event session.")
        expect(e.validationErrors).toEqual({
          sourceUrl: ["Source Url is missing."],
        })
      }
    })
  })
})
