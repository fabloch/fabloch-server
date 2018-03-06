import { ObjectId } from "mongodb"

const eventModelSessionList = async ({ eventModelId }, { mongo: { EventSessions } }) =>
  EventSessions.find({ eventModelId: ObjectId(eventModelId) }).toArray()

export default eventModelSessionList
