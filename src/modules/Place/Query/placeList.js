const placeList = async (data, { mongo: { Places } }) => {
  if (data && data.all) {
    return Places.find({}).toArray()
  }
  return Places.find({ published: true }).toArray()
}

export default placeList
