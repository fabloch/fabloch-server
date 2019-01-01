import { ObjectId } from "mongodb"
import { UserInputError } from "apollo-server"
import { skip } from "graphql-resolvers"

const checkEventForTicket = async (
  parent,
  { eventTicketInput },
  { mongo: { EventModels, EventSessions, EventTickets }, user },
) => {
  const eventSessionId = ObjectId(eventTicketInput.eventSessionId)
  const eventSession = await EventSessions.findOne({ _id: eventSessionId })
  if (!eventSession) {
    throw new UserInputError("EventSession does not exist.")
  }

  const bookedEventTickets = await EventTickets.find({ eventSessionId }).count()
  let { seats } = eventSession
  if (!seats) {
    const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
    if (eventModel) ({ seats } = eventModel)
  }
  if (seats && bookedEventTickets === seats) {
    throw new UserInputError("No more seats for that eventSession.")
  }

  const userEventTicket = await EventTickets.findOne({
    eventSessionId,
    ownerId: user._id,
  })
  if (userEventTicket) {
    throw new UserInputError("User already has a ticket for that eventSession.")
  }
  return skip
}

export default checkEventForTicket
