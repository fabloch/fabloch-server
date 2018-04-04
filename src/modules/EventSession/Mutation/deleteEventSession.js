import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"

const deleteEventSession = async (
  data,
  { mongo: { EventSessions, EventTickets }, user },
) => {
  checkAuthenticatedUser(user)
  const eventSessionId = ObjectId(data.eventSessionId)
  const eventTickets = await EventTickets
    .find({ eventSessionId: { eventSessionId } })
    .toArray()
  const eventTicketIds = eventTickets.map(t => t._id)

  const esPromise = EventSessions.remove({ _id: eventSessionId })
  const etPromise = EventTickets.remove({ _id: { $in: eventTicketIds } })

  await Promise.all([esPromise, etPromise])
  return true
}

export default deleteEventSession
