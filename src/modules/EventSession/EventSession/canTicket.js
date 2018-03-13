const canTicket = async (
  eventSession,
  { mongo: { EventModels, EventSessions, EventTickets }, user },
) => {
  /*
    if there is a context user
    if user has a ticket, returns false
  */
  if (user) {
    const tickets = await EventTickets.find({ eventSessionId: eventSession._id }).toArray()
    const ticket = tickets.filter(t => t.ownerId.toString() === user._id.toString())
    if (ticket.length === 0) {
      const esPromise = EventSessions.findOne({ _id: eventSession._id })
      const emPromise = EventModels.findOne({ _id: eventSession.eventModelId })
      const [es, em] = await Promise.all([esPromise, emPromise])
      /* three cases to return true:
        - both limits not set
        - session limit set and condition met
        - model limit set and condition met
      */
      if (!es.seatsSuper && !em.seats) { return true }
      if (es.seatsSuper && es.seatsSuper - tickets.length <= 0) { return false }
      if (em.seats && em.seats - tickets.length <= 0) { return false }
      return true
    }
    return false
  }
  return false
}

export default canTicket
