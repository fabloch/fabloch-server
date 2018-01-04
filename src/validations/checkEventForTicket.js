import { ObjectId } from "mongodb"

export default async (eventId, Events, EventTickets) => {
  const event = await Events.findOne({ _id: ObjectId(eventId) })
  if (!event) {
    throw new Error("Event does not exist.")
  }
  const bookedEventTickets = await EventTickets.find({ eventId: ObjectId(eventId) }).count()
  if (bookedEventTickets === event.seats) {
    throw new Error("No more seats for that event.")
  }
}
