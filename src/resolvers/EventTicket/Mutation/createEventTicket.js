import { ObjectId } from "mongodb"
import { combineResolvers } from "graphql-resolvers"

import { isAuthenticated } from "../../_shared/auth"
import checkEventForTicket from "./checkEventForTicket"

const createEventTicket = combineResolvers(
  isAuthenticated,
  checkEventForTicket,
  async (_, { eventTicketInput }, context) => {
    const {
      mongo: { EventTickets },
      user,
    } = context
    const eventTicket = {
      ownerId: user._id,
      eventSessionId: ObjectId(eventTicketInput.eventSessionId),
    }
    const response = await EventTickets.insertOne(eventTicket)
    eventTicket._id = response.insertedId
    return eventTicket
  },
)

export default createEventTicket
