import { ObjectId } from "mongodb"
import { combineResolvers } from "graphql-resolvers"
import { isAuthenticated, isOwnerOrAdmin } from "../../_shared/auth"

const deleteEventTicket = combineResolvers(
  isAuthenticated,
  async (_, { eventTicketId }, { mongo: { EventTickets }, user }) => {
    const ticket = await EventTickets.findOne({
      _id: ObjectId(eventTicketId),
    })
    isOwnerOrAdmin(ticket, user)
    return EventTickets.remove(ticket)
  },
)
export default deleteEventTicket
