import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import hasRole from "../../_shared/hasRole"
import ValidationError from "../../_shared/ValidationError"

const deleteEventCat = async (
  { eventCatId },
  { mongo: { EventCats, EventModels, EventSessions }, user },
) => {
  checkAuthenticatedUser(user)

  if (!hasRole(user, "admin")) {
    throw new ValidationError([{ key: "main", message: "Not allowed." }])
  }

  const _id = ObjectId(eventCatId)
  await EventCats.remove({ _id })

  // const deletedEventCat = { ...eventCatFromDb, name: eventCatInput.name }
  // await EventCats.delete(eventCatFromDb, deletedEventCat)
  //
  await EventModels.updateMany(
    { "eventCats.id": _id },
    { $pull: { eventCats: { id: _id } } },
  )
  await EventSessions.updateMany(
    { "eventCats.id": _id },
    { $pull: { eventCats: { id: _id } } },
  )

  return true
}

export default deleteEventCat
