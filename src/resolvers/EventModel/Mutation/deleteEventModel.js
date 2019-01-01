import { ObjectId } from "mongodb"
import { combineResolvers } from "graphql-resolvers"
import { isAuthenticated, isOwnerOrAdmin } from "../../_shared/auth"

const deleteEventModel = combineResolvers(
  isAuthenticated,
  async (parent, args, { mongo: { EventModels, EventSessions, EventTickets }, user }) => {
    const eventModelId = ObjectId(args.eventModelId)
    const eventModelFromDb = await EventModels.findOne({ _id: eventModelId })
    isOwnerOrAdmin(eventModelFromDb, user)
    const eventSessions = await EventSessions.find({ eventModelId }).toArray()
    const eventSessionIds = eventSessions.map(e => e._id)

    const eventTickets = await EventTickets.find({
      eventSessionId: { $in: eventSessionIds },
    }).toArray()
    const eventTicketIds = eventTickets.map(t => t._id)

    const emPromise = EventModels.remove({ _id: eventModelId })
    const esPromise = EventSessions.remove({ _id: { $in: eventSessionIds } })
    const etPromise = EventTickets.remove({ _id: { $in: eventTicketIds } })

    await Promise.all([emPromise, esPromise, etPromise])
    return true
  },
)

export default deleteEventModel
