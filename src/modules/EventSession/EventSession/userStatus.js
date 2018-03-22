import moment from "moment"

require("twix")

const output = (canTicket, info, overlapping = undefined) => ({ canTicket, info, overlapping })

const userStatus = async (
  eventSession,
  { mongo: { EventModels, EventSessions, EventTickets }, user },
) => {
  /*
    if there is a context user
    if user has a ticket, returns false
  */
  if (user) {
    const sessionTickets = await EventTickets.find({ eventSessionId: eventSession._id }).toArray()
    const ticket = sessionTickets.filter(t => t.ownerId.toString() === user._id.toString())
    if (ticket.length === 0) {
      const userTickets = await EventTickets.find({ ownerId: user._id }).toArray()
      const userSessionIds = userTickets.map(t => t.eventSessionId)
      const prevUserSessions = await EventSessions.find({ _id: { $in: userSessionIds } }).toArray()
      const eventTwix = moment(eventSession.start).twix(moment(eventSession.end))
      const overlapping = prevUserSessions.filter((prevUS) => {
        const prevUSTwix = moment(prevUS.start).subtract(15, "m").twix(moment(prevUS.end).add(15, "m"))
        return prevUSTwix.overlaps(eventTwix)
      })
      if (overlapping.length) { return output(false, "overlap", overlapping[0]) }

      const esPromise = EventSessions.findOne({ _id: eventSession._id })
      const emPromise = EventModels.findOne({ _id: eventSession.eventModelId })
      const [es, em] = await Promise.all([esPromise, emPromise])
      /* three cases to return true:
        - both limits not set
        - session limit set and condition met
        - model limit set and condition met
      */
      if (!es.seatsSuper && !em.seats) { return output(true, "noLimit") }
      if (es.seatsSuper && es.seatsSuper - sessionTickets.length <= 0) { return output(false, "full") }
      if (em.seats && em.seats - sessionTickets.length <= 0) { return output(false, "full") }
      return output(true, "seatsLeft")
    }
    return output(false, "hasTicket")
  }
  return output(false, "noUser")
}

export default userStatus
