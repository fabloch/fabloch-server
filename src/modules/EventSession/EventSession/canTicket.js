const canTicket = async (eventSession, { mongo: { EventSessions, EventTickets }, user }) => {
  /*
    if there is a context user
    if user has a ticket, returns false
  */
  if (user) {
    const tickets = await EventTickets.find({ eventSessionId: eventSession._id }).toArray()
    const ticket = tickets.filter(t => t.ownerId.toString() === user._id.toString())
    if (ticket.length === 0) {
      const event = await EventSessions.findOne({ _id: eventSession._id })
      if (!event.seats || event.seats - tickets.length > 0) {
        return true
      }
    }
    return false
  }
}

export default canTicket
