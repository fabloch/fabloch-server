const placeList = async ({ mongo: { Places } }) =>
  Places.find({ published: true }).toArray()

export default placeList
