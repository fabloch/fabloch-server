import { ObjectId } from "mongodb"
import { combineResolvers } from "graphql-resolvers"
import { isAuthenticated, isOwnerOrAdmin } from "../../_shared/auth"

const deleteEventSession = combineResolvers(
  isAuthenticated,
  async (_, args, { mongo: { EventSessions, EventTickets }, user }) => {
    const eventSessionId = ObjectId(args.eventSessionId)
    const eventSessionFromDb = await EventSessions.findOne({ _id: eventSessionId })
    isOwnerOrAdmin(eventSessionFromDb, user)
    const eventTickets = await EventTickets.find({ eventSessionId }).toArray()
    const eventTicketIds = eventTickets.map(t => t._id)

    const esPromise = EventSessions.removeOne({ _id: eventSessionId })
    const etPromise = EventTickets.remove({ _id: { $in: eventTicketIds } })

    await Promise.all([esPromise, etPromise])
    return true
  },
)

export default deleteEventSession
