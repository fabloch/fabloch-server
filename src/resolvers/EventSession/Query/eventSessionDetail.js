import { ObjectId } from "mongodb"

const eventSessionDetail = async (_, { id }, { mongo: { EventSessions } }) => {
  const eventSession = await EventSessions.findOne({ _id: ObjectId(id) })
  if (!eventSession) {
    return null
  }
  return eventSession
}

export default eventSessionDetail
