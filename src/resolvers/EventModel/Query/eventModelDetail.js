import { ObjectId } from "mongodb"

const eventModelDetail = async (parent, { id }, { mongo: { EventModels } }) => {
  const eventModel = await EventModels.findOne({ _id: ObjectId(id) })
  if (!eventModel) {
    return null
  }
  return eventModel
}

export default eventModelDetail
