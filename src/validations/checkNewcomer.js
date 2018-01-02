const checkNewcomer = async (newcomer, Collection) => {
  const newcomerFromDb = await Collection.find({ email: newcomer.email }).count()
  if (newcomerFromDb !== 0) {
    throw new Error(`Email already in ${Collection.collectionName}.`)
  }
}

export default checkNewcomer
