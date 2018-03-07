import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import checkMissing from "../../_shared/checkMissing"
import ValidationError from "../../_shared/ValidationError"

const updateEventCat = async (
  { eventCatInput },
  { mongo: { EventCats, EventModels, EventSessions }, user },
) => {
  checkAuthenticatedUser(user)
  let errors = []
  errors = checkMissing(["name"], eventCatInput, errors)
  if (errors.length) throw new ValidationError(errors)

  const _id = ObjectId(eventCatInput.id)
  const eventCatFromDb = await EventCats.findOne({ _id })
  const updatedEventCat = { ...eventCatFromDb, name: eventCatInput.name }
  await EventCats.update(eventCatFromDb, updatedEventCat)

  await EventModels.updateMany({ "eventCats.id": _id }, { $set: { "eventCats.$.name": eventCatInput.name } })
  await EventSessions.updateMany({ "eventCats.id": _id }, { $set: { "eventCats.$.name": eventCatInput.name } })

  return updatedEventCat
}

export default updateEventCat
