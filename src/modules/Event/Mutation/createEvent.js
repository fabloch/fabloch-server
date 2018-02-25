import checkAuthenticatedUser from "../../../validations/checkAuthenticatedUser"
import checkEventDates from "./checkEventDates"
import pubsub from "../../../utils/pubsub"

const createEvent = async ({ eventInput }, { mongo: { Events }, user }) => {
  checkAuthenticatedUser(user)
  const event = eventInput
  checkEventDates(eventInput)
  event.ownerId = user._id
  const response = await Events.insert(event)
  const [_id] = response.insertedIds
  event._id = _id
  pubsub.publish("Event", { Event: { mutation: "CREATED", node: event } })
  return event
}

export default createEvent
