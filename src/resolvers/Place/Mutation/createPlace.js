import { UserInputError } from "apollo-server"
import { combineResolvers } from "graphql-resolvers"
import { isEmpty } from "ramda"

import { isAuthenticated } from "../../_shared/auth"
import { checkMissing } from "../../_shared/input"

const createPlace = combineResolvers(
  isAuthenticated,
  async (parent, { placeInput }, { mongo: { Places } }) => {
    let validationErrors = {}
    validationErrors = checkMissing(validationErrors, "title", placeInput)
    validationErrors = checkMissing(validationErrors, "zipCode", placeInput)
    validationErrors = checkMissing(validationErrors, "city", placeInput)
    validationErrors = checkMissing(validationErrors, "country", placeInput)
    if (!isEmpty(validationErrors)) {
      throw new UserInputError("Failed to save place.", { validationErrors })
    }

    const response = await Places.insertOne(placeInput)
    placeInput._id = response.insertedId
    return placeInput
  },
)

export default createPlace
