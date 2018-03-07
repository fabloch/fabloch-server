import checkAuthenticatedUser from "../../_shared/checkAuthenticatedUser"
import checkMissing from "../../_shared/checkMissing"
import ValidationError from "../../_shared/ValidationError"

const createEventCat = async ({ eventCatInput }, { mongo: { EventCats }, user }) => {
  checkAuthenticatedUser(user)
  let errors = []
  errors = checkMissing(
    ["name"],
    eventCatInput,
    errors,
  )
  if (errors.length) throw new ValidationError(errors)

  const eventCat = eventCatInput
  const response = await EventCats.insert(eventCat)
  const [_id] = response.insertedIds
  eventCat._id = _id
  return eventCat
}

export default createEventCat
