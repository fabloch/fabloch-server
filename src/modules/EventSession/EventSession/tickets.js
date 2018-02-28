const tickets = async (eventSession, { mongo: { EventTickets } }) =>
  EventTickets.find({ eventSessionId: eventSession._id }).toArray()

export default tickets
