import DataLoader from "dataloader"

async function usersById(Users, ids) {
  return Users.find({ _id: { $in: ids } }).toArray()
}

const userLoaderById = Users => new DataLoader(
  ids => usersById(Users, ids),
  { cacheKeyFn: id => id.toString() },
)

const dataLoaders = ({ Users }) => ({
  userLoaderById: userLoaderById(Users),
})

export default dataLoaders
