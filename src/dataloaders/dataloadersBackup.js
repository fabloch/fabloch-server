const DataLoader = require('dataloader')

async function batchUsersById (Users, ids) {
  return Users.find({ _id: { $in: ids}}).toArray()
}

async function batchUsersByEmail (Users, emails) {
  return Users.find({ email: { $in: emails}}).toArray()
}

const userLoaderByEmail = (Users) => new DataLoader(
  emails => batchUsersByEmail(Users, emails).then(users => {
    for (let user of users) {
      userLoaderById.prime(user.id, user)
    }
    return users
  }),
  { cacheKeyFn: emails => emails.toString() },
)

const userLoaderById = (Users) => new DataLoader(
  ids => batchUsersById(Users, ids).then(users => {
    for (let user of users) {
      userLoaderByEmail.prime(user.email, user)
    }
    return users
  }),
  { cacheKeyFn: id => id.toString() },
)

module.exports = ({ Users }) => ({
  userLoaderById: userLoaderById(Users),
  userLoaderByEmail: userLoaderById(Users),
})
