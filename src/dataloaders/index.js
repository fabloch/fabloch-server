import DataLoader from 'dataloader'

async function batchUsersById(Users, ids) {
  return Users.find({ _id: { $in: ids } }).toArray()
}

// async function batchUsersByEmail (Users, emails) {
//   return Users.find({ email: { $in: emails}}).toArray()
// }
//
const userLoaderById = Users => new DataLoader(
  ids => batchUsersById(Users, ids),
  { cacheKeyFn: id => id.toString() },
)

// const userLoaderByEmail = (Users) => new DataLoader(
//   emails => batchUsersByEmail(Users, emails),
//   { cacheKeyFn: emails => emails.toString() },
// )

const dataLoaders = ({ Users }) => ({
  userLoaderById: userLoaderById(Users),
  // userLoaderByEmail: userLoaderById(Users),
})

export default dataLoaders
