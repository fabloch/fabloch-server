const tickets = async (event, { mongo: { EventTickets } }) =>
  EventTickets.find({ eventId: event._id }).toArray()

export default tickets
