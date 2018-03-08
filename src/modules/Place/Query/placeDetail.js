import { ObjectId } from "mongodb"

const placeDetail = async ({ id }, { mongo: { Places } }) => {
  const place = await Places.findOne({ _id: ObjectId(id) })
  if (!place) {
    return null
  }
  return place
}

export default placeDetail
