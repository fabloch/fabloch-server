const tickets = async (eventSession, _, { mongo: { EventTickets } }) =>
  EventTickets.find({ eventSessionId: eventSession._id }).toArray()

export default tickets
