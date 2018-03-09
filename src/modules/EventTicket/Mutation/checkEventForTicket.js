import { ObjectId } from "mongodb"
import ValidationError from "../../_shared/ValidationError"

const checkEventForTicket = async (
  id,
  { mongo: { EventModels, EventSessions, EventTickets }, user },
) => {
  const eventSessionId = ObjectId(id)
  const eventSession = await EventSessions.findOne({ _id: eventSessionId })
  if (!eventSession) {
    throw new ValidationError([{ key: "main", message: "EventSession does not exist." }])
  }

  const bookedEventTickets = await EventTickets
    .find({ eventSessionId }).count()
  let seats = eventSession.seatsSuper
  if (!seats) {
    const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
    if (eventModel) ({ seats } = eventModel)
  }
  if (seats && bookedEventTickets === seats) {
    throw new ValidationError([{ key: "main", message: "No more seats for that eventSession." }])
  }

  const userEventTicket = await EventTickets.findOne({
    eventSessionId,
    ownerId: user._id,
  })
  if (userEventTicket) {
    throw new ValidationError([{ key: "main", message: "User already has a ticket for that eventSession." }])
  }
}

export default checkEventForTicket
