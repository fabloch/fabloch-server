import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import checkEventDates from "./checkEventDates"
import pubsub from "../../../utils/pubsub"
import ValidationError from "../../_shared/ValidationError"
import checkForbidden from "../../_shared/checkForbidden"

const createEventSession = async (
  { eventSessionInput },
  { mongo: { EventCats, EventModels, EventSessions }, user },
) => {
  checkAuthenticatedUser(user)
  if (!eventSessionInput.eventModelId) throw new ValidationError([{ key: "main", message: "eventModelId missing." }])
  const eventModel = await EventModels.findOne({ _id: ObjectId(eventSessionInput.eventModelId) })
  if (!eventModel) throw new ValidationError([{ key: "main", message: "Parent eventModel does not exist." }])

  let errors = []
  checkForbidden(
    ["title", "intro", "description", "seats", "placeId", "eventCats"],
    eventSessionInput,
    errors,
  )
  errors = checkEventDates(eventSessionInput, errors)
  if (errors.length) throw new ValidationError(errors)

  const eventSession = eventSessionInput
  eventSession.ownerId = user._id
  eventSession.eventModelId = eventModel._id

  // placeSuperId
  if (eventSession.placeSuperId) { eventSession.placeSuperId = ObjectId(eventSession.placeSuperId) }

  // speakerSuperId
  if (eventSession.speakerSuperId) {
    eventSession.speakerSuperId = ObjectId(eventSession.speakerSuperId)
  }

  // eventCatSuperIds
  if (eventSession.eventCatSuperIds) {
    const ids = eventSession.eventCatSuperIds.map(id => ObjectId(id))
    const ecList = await EventCats.find({ _id: { $in: ids } }).toArray()
    const eventCatsSuper = ecList.map(ec => ({
      id: ec._id,
      name: ec.name,
      color: ec.color,
    }))
    eventSession.eventCatsSuper = eventCatsSuper
  }

  const response = await EventSessions.insert(eventSession)
  const [_id] = response.insertedIds
  eventSession._id = _id
  pubsub.publish("EventSession", { EventSession: { mutation: "CREATED", node: eventSession } })
  return eventSession
}

export default createEventSession
