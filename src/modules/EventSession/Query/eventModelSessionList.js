import { ObjectId } from "mongodb"

const eventModelSessionList = async ({ eventModelId }, { mongo: { EventSessions } }) =>
  EventSessions.find({ eventModelId: ObjectId(eventModelId) }).sort({ start: 1 }).toArray()

export default eventModelSessionList
