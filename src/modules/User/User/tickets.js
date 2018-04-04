const tickets = async (user, context) => {
  const { mongo: { EventTickets } } = context
  const ticketList = await EventTickets.find({ ownerId: user._id }).toArray()
  return ticketList
}

export default tickets
