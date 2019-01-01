import { ObjectId } from "mongodb"

const eventCatSessionList = async (
  _,
  { eventCatId },
  { mongo: { EventModels, EventSessions } },
) => {
  const catId = ObjectId(eventCatId)
  const eventModels = await EventModels.find({ "eventCats.id": catId }).toArray()
  const eventModelIds = eventModels.map(em => em._id)
  const eventSessions = await EventSessions.find({
    $or: [{ "eventCats.id": catId }, { eventModelId: { $in: eventModelIds } }],
  })
    .sort({ start: 1 })
    .toArray()
  return eventSessions
}

export default eventCatSessionList
