import { ObjectId } from "mongodb"

const eventDetail = async ({ id }, { mongo: { Events } }) => {
  const event = await Events.findOne({ _id: ObjectId(id) })
  if (!event) {
    return null
  }
  return event
}

export default eventDetail
