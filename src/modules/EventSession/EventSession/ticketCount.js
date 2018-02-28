const ticketCount = async (eventSession, { mongo: { EventTickets } }) =>
  EventTickets.find({ eventSessionId: eventSession._id }).count()

export default ticketCount
