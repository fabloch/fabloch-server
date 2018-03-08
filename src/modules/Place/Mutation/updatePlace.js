import { ObjectId } from "mongodb"
import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import checkMissing from "../../_shared/checkMissing"
import ValidationError from "../../_shared/ValidationError"
import hasRole from "../../_shared/hasRole"

const updatePlace = async (
  { placeInput },
  { mongo: { Places, EventModels, EventSessions }, user },
) => {
  checkAuthenticatedUser(user)
  if (!hasRole(user, "admin")) {
    throw new ValidationError([{ key: "main", message: "Not allowed." }])
  }

  let errors = []
  errors = checkMissing([
    "id",
    "title",
    "published",
    "street1",
    "zipCode",
    "city",
    "country",
    "lat",
    "lng"], placeInput, errors)
  if (errors.length) throw new ValidationError(errors)

  const _id = ObjectId(placeInput.id)
  const place = placeInput
  delete place.id
  place._id = _id

  await Places.update({ _id }, placeInput)

  await EventModels.updateMany({ "places.id": _id }, { $set: { "places.$.name": placeInput.name } })
  await EventSessions.updateMany({ "places.id": _id }, { $set: { "places.$.name": placeInput.name } })

  return place
}

export default updatePlace
