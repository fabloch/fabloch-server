import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import hasRole from "../../_shared/hasRole"
import checkMissing from "../../_shared/checkMissing"
import ValidationError from "../../_shared/ValidationError"

const createPlace = async ({ placeInput }, { mongo: { Places }, user }) => {
  checkAuthenticatedUser(user)
  let errors = []
  errors = checkMissing(
    ["title", "zipCode", "city", "country"],
    placeInput,
    errors,
  )
  if (errors.length) throw new ValidationError(errors)

  const place = placeInput
  if (hasRole(user, "admin")) {
    place.admin = true
  }
  const response = await Places.insert(place)
  const [_id] = response.insertedIds
  place._id = _id
  return place
}

export default createPlace
