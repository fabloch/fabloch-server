const bookings = async (eventModel, { mongo: { EventTickets } }) =>
  EventTickets.find({ eventModelId: eventModel._id }).count()

export default bookings
