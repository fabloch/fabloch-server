const tickets = async (eventModel, { mongo: { EventTickets } }) =>
  EventTickets.find({ eventModelId: eventModel._id }).toArray()

export default tickets
