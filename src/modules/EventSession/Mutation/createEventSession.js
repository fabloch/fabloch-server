import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import checkEventDates from "./checkEventDates"
import pubsub from "../../../utils/pubsub"
import ValidationError from "../../_shared/ValidationError"

const createEventSession = async (
  { eventSessionInput },
  { mongo: { EventModels, EventSessions }, user },
) => {
  checkAuthenticatedUser(user)
  if (!eventSessionInput.eventModelId) throw new ValidationError([{ key: "main", message: "eventModelId missing." }])
  const eventModel = await EventModels.findOne({ _id: ObjectId(eventSessionInput.eventModelId) })
  if (!eventModel) throw new ValidationError([{ key: "main", message: "Parent eventModel does not exist." }])

  let errors = []
  errors = checkEventDates(eventSessionInput, errors)
  if (errors.length) throw new ValidationError(errors)

  const eventSession = eventSessionInput
  eventSession.ownerId = user._id
  eventSession.eventModelId = eventModel._id
  const response = await EventSessions.insert(eventSession)
  const [_id] = response.insertedIds
  eventSession._id = _id
  pubsub.publish("EventSession", { EventSession: { mutation: "CREATED", node: eventSession } })
  return eventSession
}

export default createEventSession
