import { ObjectId } from "mongodb"

export default async (eventModelId, user, EventModels, EventTickets) => {
  const eventModel = await EventModels.findOne({ _id: ObjectId(eventModelId) })
  if (!eventModel) {
    throw new Error("EventModel does not exist.")
  }

  const bookedEventTickets = await EventTickets.find({ eventModelId: ObjectId(eventModelId) }).count()
  if (bookedEventTickets === eventModel.seats) {
    throw new Error("No more seats for that eventModel.")
  }

  const userEventTicket = await EventTickets.findOne({
    eventModelId: ObjectId(eventModelId),
    participantId: user._id,
  })
  if (userEventTicket) {
    throw new Error("User already has a ticket for that eventModel.")
  }
}
