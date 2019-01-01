const tickets = async (user, args, { mongo: { EventTickets } }) => {
  const ticketList = await EventTickets.find({ ownerId: user._id }).toArray()
  return ticketList
}

export default tickets
