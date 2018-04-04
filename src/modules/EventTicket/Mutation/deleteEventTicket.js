import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../../validations/checkAuthenticatedUser"

const deleteEventTicket = async ({ eventTicketInput }, { mongo: { EventTickets }, user }) => {
  checkAuthenticatedUser(user)
  await EventTickets.remove({
    ownerId: user._id,
    eventSessionId: ObjectId(eventTicketInput.eventSessionId),
  })
  return true
}

export default deleteEventTicket
