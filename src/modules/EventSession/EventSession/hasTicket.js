
const hasTicket = async (eventSession, { mongo: { EventTickets }, user }) => {
  if (user) {
    const ticket = await EventTickets.findOne({
      eventSessionId: eventSession._id, ownerId: user._id,
    })
    if (ticket) {
      return true
    }
  }
  return false
}

export default hasTicket
