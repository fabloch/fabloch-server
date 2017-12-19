import { ObjectId } from 'mongodb'
import resolvers from './resolvers'
import connectMongo from '../../testUtils/mongoTest'

let mongo

describe('user resolver', () => {
  describe('Query.User', () => {
    beforeAll(async () => { mongo = await connectMongo() })
    beforeEach(async () => { await mongo.beforeEach() })
    afterEach(() => mongo.afterEach())
    afterAll(() => { mongo.tearDown() })

    describe('given a correct id', () => {
      it('returns a user object', async () => {
        await mongo.loadUsers()
        const context = { mongo }
        return resolvers.Query.User(null, { id: '5a31b456c5e7b54a9aba3782' }, context).then((results) => {
          expect(results).toEqual({
            _id: ObjectId('5a31b456c5e7b54a9aba3782'),
            name: 'Seb Idis',
            email: 'user@example.com',
            password: '$2a$10$Htm2b52NAP2XE5pD8LnK2OP58PTf9kXxaEtKxMmbI28Udappwayy6',
            version: 1,
          })
        })
      })
    })
  })

  describe('Mutation.createUser', () => {
    it('persists the user in database', async () => {
      const context = { mongo }
      const newUser = {
        name: 'New User',
        authProvider: {
          email: {
            email: 'user@example.com',
            password: '$2a$10$4gx3tkvkV5uosBHRyjAOVe7y3Za8BPuicCwWIDFAk.hju4IuLip.e',
          },
        },
      }
      const response = await resolvers.Mutation.createUser(null, newUser, context)

      expect(response).toMatchObject({
        email: 'user@example.com',
        name: 'New User',
        version: 1,
      })
    })
  })

  describe('User', () => {
    it('returns id from _id', () => {
      const user = {
        _id: ObjectId('5a343c2d9d29ab155b930b3f'),
        body: 'Lorem Ipsum',
      }
      expect(resolvers.User.id(user)).toEqual('5a343c2d9d29ab155b930b3f')
    })
  })
})
