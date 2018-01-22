import { ObjectId } from "mongodb"
import resolvers from "../resolvers"
import connectMongo from "../../../testUtils/mongoTest"

let mongo

describe("User Mutation resolvers", () => {
  beforeAll(async () => { mongo = await connectMongo() })
  beforeEach(async () => { await mongo.beforeEach() })
  afterEach(async () => { await mongo.afterEach() })
  afterAll(async () => { await mongo.afterAll() })

  describe("createUser", () => {
    describe("normal newcomer", () => {
      it("with newcomerToken, username and password, persists the user", async () => {
        await mongo.loadNewcomers()
        const context = { mongo }
        const newUser = {
          authProvider: {
            newcomer: {
              token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIzQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE1ODQ0OTI1fQ.mNeqSHD4dT1FTfieci5fZGxktUWoiKXt2F4zGCTsYQo",
              username: "user3",
              password: "Mot2pa$$e.De.Ouf",
            },
          },
        }
        const response = await resolvers.Mutation.createUser(null, newUser, context)
        expect(response.username).toEqual("user3")
        expect(response.email).toEqual("user3@example.com")
        expect(response.version).toEqual(1)
        expect(response.jwt).toMatch(/ey.+\.ey.+\..+/)
      })
    })
    it("raises error if no newcomer", async () => {
      expect.assertions(2)
      const context = { mongo }
      const newUser = {
        authProvider: {
          newcomer: {
            token: "wrongToken",
            username: "user1",
            password: "Mot2pa$$e.De.Ouf",
          },
        },
      }
      try {
        await resolvers.Mutation.createUser(null, newUser, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["No newcomer with that token."] })
      }
    })
    it("raises error if user already exists", async () => {
      expect.assertions(2)
      await mongo.loadNewcomers()
      await mongo.loadUsers()
      const context = { mongo }
      const newUser = {
        authProvider: {
          newcomer: {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE1ODQ1MzQzfQ.pJvXypuRpjdnVZoITVZzg8b85ZM-yuJWEzd8O4OBekA",
            username: "user10",
            password: "Mot2pa$$e.De.Ouf",
          },
        },
      }
      try {
        await resolvers.Mutation.createUser(null, newUser, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ main: ["An account was already created with this email."] })
      }
    })
    it("raises error if username taken", async () => {
      expect.assertions(2)
      await mongo.loadNewcomers()
      await mongo.loadUsers()
      const context = { mongo }
      const newUser = {
        authProvider: {
          newcomer: {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIzQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE1ODQ0OTI1fQ.mNeqSHD4dT1FTfieci5fZGxktUWoiKXt2F4zGCTsYQo",
            username: "user1",
            password: "Mot2pa$$e.De.Ouf",
          },
        },
      }
      try {
        await resolvers.Mutation.createUser(null, newUser, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ username: ["This username is not available."] })
      }
    })
    it("raises error if username not in lowercase", async () => {
      expect.assertions(2)
      await mongo.loadNewcomers()
      const context = { mongo }
      const newUser = {
        authProvider: {
          newcomer: {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIzQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE1ODQ0OTI1fQ.mNeqSHD4dT1FTfieci5fZGxktUWoiKXt2F4zGCTsYQo",
            username: "USER",
            password: "Mot2pa$$e.De.Ouf",
          },
        },
      }
      try {
        await resolvers.Mutation.createUser(null, newUser, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ username: ["Username should only container lowercase letters, numbers, dashes or underscores."] })
      }
    })
    it("raises error if username has a space", async () => {
      expect.assertions(2)
      await mongo.loadNewcomers()
      const context = { mongo }
      const newUser = {
        authProvider: {
          newcomer: {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIzQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE1ODQ0OTI1fQ.mNeqSHD4dT1FTfieci5fZGxktUWoiKXt2F4zGCTsYQo",
            username: "user 3",
            password: "Mot2pa$$e.De.Ouf",
          },
        },
      }
      try {
        await resolvers.Mutation.createUser(null, newUser, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ username: ["Username should only container lowercase letters, numbers, dashes or underscores."] })
      }
    })
    it("raises error if username has special char", async () => {
      expect.assertions(2)
      await mongo.loadNewcomers()
      const context = { mongo }
      const newUser = {
        authProvider: {
          newcomer: {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIzQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE1ODQ0OTI1fQ.mNeqSHD4dT1FTfieci5fZGxktUWoiKXt2F4zGCTsYQo",
            username: "u$er3",
            password: "Mot2pa$$e.De.Ouf",
          },
        },
      }
      try {
        await resolvers.Mutation.createUser(null, newUser, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ username: ["Username should only container lowercase letters, numbers, dashes or underscores."] })
      }
    })
    it("raises an error if password too weak", async () => {
      expect.assertions(2)
      await mongo.loadNewcomers()
      const context = { mongo }
      const newUser = {
        authProvider: {
          newcomer: {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIzQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE1ODQ0OTI1fQ.mNeqSHD4dT1FTfieci5fZGxktUWoiKXt2F4zGCTsYQo",
            username: "user1",
            password: "password",
          },
        },
      }
      try {
        await resolvers.Mutation.createUser(null, newUser, context)
      } catch (e) {
        expect(e.message).toEqual("The request is invalid.")
        expect(e.state).toEqual({ password: ["Password is too weak."] })
      }
    })
    it("deletes newcomer after sucessful user creation", async () => {
      await mongo.loadNewcomers()
      const context = { mongo }
      const newUser = {
        authProvider: {
          newcomer: {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIzQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE1ODQ0OTI1fQ.mNeqSHD4dT1FTfieci5fZGxktUWoiKXt2F4zGCTsYQo",
            username: "user3",
            password: "Mot2pa$$e.De.Ouf",
          },
        },
      }
      const response = await resolvers.Mutation.createUser(null, newUser, context)
      expect(response.email).toEqual("user3@example.com")
      const newcomer = await mongo.Newcomers.findOne({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIzQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE1ODQ0OTI1fQ.mNeqSHD4dT1FTfieci5fZGxktUWoiKXt2F4zGCTsYQo" })
      expect(newcomer).toEqual(null)
    })
  })
})
