const ticketCount = async (eventSession, _, { mongo: { EventTickets } }) =>
  EventTickets.find({ eventSessionId: eventSession._id }).count()

export default ticketCount
