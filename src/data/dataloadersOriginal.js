const DataLoader = require('dataloader')

async function batchUsers (Users, keys) {
  return Users.find({ _id: { $in: keys}}).toArray()
}

module.exports = ({ Users }) => ({
  userByIdLoader: new DataLoader(
    keys => batchUsers(Users, keys),
    { cacheKeyFn: key => key.toString() },
  )
})
