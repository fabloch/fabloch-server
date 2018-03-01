import { ObjectId } from "mongodb"

const eventSessionDetail = async ({ eventSessionId }, { mongo: { EventSessions } }) => {
  const eventSession = await EventSessions.findOne({ _id: ObjectId(eventSessionId) })
  if (!eventSession) {
    return null
  }
  return eventSession
}

export default eventSessionDetail
