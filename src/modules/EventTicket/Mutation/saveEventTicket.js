import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../../validations/checkAuthenticatedUser"
import checkEventForTicket from "./checkEventForTicket"

const saveEventTicket = async ({ eventTicketInput }, context) => {
  const { mongo: { EventTickets }, user } = context
  const eventTicket = {
    ownerId: user._id,
    eventSessionId: ObjectId(eventTicketInput.eventSessionId),
  }
  checkAuthenticatedUser(user)
  await checkEventForTicket(
    eventTicketInput.eventSessionId,
    context,
  )
  const response = await EventTickets.insert(eventTicket)
  const [_id] = response.insertedIds
  eventTicket._id = _id
  return eventTicket
}

export default saveEventTicket
