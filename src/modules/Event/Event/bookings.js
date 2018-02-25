const bookings = (event, { mongo: { EventTickets } }) =>
  EventTickets.find({ eventId: event._id }).count()

export default bookings
