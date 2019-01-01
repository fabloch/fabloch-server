import { ObjectId } from "mongodb"
import { UserInputError } from "apollo-server"
import { combineResolvers } from "graphql-resolvers"
import { isEmpty } from "ramda"

import { isAuthenticated } from "../../_shared/auth"
import { checkMissing } from "../../_shared/input"

const updatePlace = combineResolvers(
  isAuthenticated,
  async (parent, { placeInput }, { mongo: { Places, EventModels, EventSessions } }) => {
    let validationErrors = {}
    validationErrors = checkMissing(validationErrors, "id", placeInput)
    validationErrors = checkMissing(validationErrors, "title", placeInput)
    validationErrors = checkMissing(validationErrors, "street1", placeInput)
    validationErrors = checkMissing(validationErrors, "zipCode", placeInput)
    validationErrors = checkMissing(validationErrors, "city", placeInput)
    validationErrors = checkMissing(validationErrors, "country", placeInput)
    if (!isEmpty(validationErrors)) {
      throw new UserInputError("Failed to save place.", { validationErrors })
    }

    const _id = ObjectId(placeInput.id)
    const place = placeInput
    delete place.id
    place._id = _id

    await Places.update({ _id }, placeInput)

    await EventModels.updateMany(
      { "places.id": _id },
      { $set: { "places.$.name": placeInput.name } },
    )
    await EventSessions.updateMany(
      { "places.id": _id },
      { $set: { "places.$.name": placeInput.name } },
    )

    return place
  },
)

export default updatePlace
