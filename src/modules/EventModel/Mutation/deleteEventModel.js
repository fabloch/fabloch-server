import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"

const deleteEventModel = async (
  data,
  { mongo: { EventModels, EventSessions, EventTickets }, user },
) => {
  checkAuthenticatedUser(user)
  const eventModelId = ObjectId(data.eventModelId)
  const eventSessions = await EventSessions
    .find({ eventModelId })
    .toArray()
  const eventSessionIds = eventSessions.map(e => e._id)

  const eventTickets = await EventTickets
    .find({ eventSessionId: { $in: eventSessionIds } })
    .toArray()
  const eventTicketIds = eventTickets.map(t => t._id)

  const emPromise = EventModels.remove({ _id: eventModelId })
  const esPromise = EventSessions.remove({ _id: { $in: eventSessionIds } })
  const etPromise = EventTickets.remove({ _id: { $in: eventTicketIds } })

  await Promise.all([emPromise, esPromise, etPromise])
  return true
}

export default deleteEventModel
