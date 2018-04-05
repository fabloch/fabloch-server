import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import checkMissing from "../../_shared/checkMissing"
import ValidationError from "../../_shared/ValidationError"
import hasRole from "../../_shared/hasRole"

const updateEventCat = async (
  { eventCatInput },
  { mongo: { EventCats, EventModels, EventSessions }, user },
) => {
  checkAuthenticatedUser(user)
  if (!hasRole(user, "admin")) {
    throw new ValidationError([{ key: "main", message: "Not allowed." }])
  }

  let errors = []
  errors = checkMissing(["name"], eventCatInput, errors)
  if (errors.length) throw new ValidationError(errors)

  const _id = ObjectId(eventCatInput.id)
  const eventCatFromDb = await EventCats.findOne({ _id })
  const updatedEventCat = {
    ...eventCatFromDb,
    name: eventCatInput.name,
    color: eventCatInput.color,
  }
  await EventCats.update(eventCatFromDb, updatedEventCat)

  await EventModels.updateMany(
    { "eventCats.id": _id },
    { $set: { "eventCats.$.name": eventCatInput.name, "eventCats.$.color": eventCatInput.color } },
  )
  await EventSessions.updateMany(
    { "eventCats.id": _id },
    { $set: { "eventCats.$.name": eventCatInput.name, "eventCats.$.color": eventCatInput.color } },
  )

  return updatedEventCat
}

export default updateEventCat
