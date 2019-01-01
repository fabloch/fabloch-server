const placeList = async (parent, args, { mongo: { Places } }) => {
  if (args && args.all) {
    return Places.find({}).toArray()
  }
  return Places.find({ published: true }).toArray()
}

export default placeList
