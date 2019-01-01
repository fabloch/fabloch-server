import { UserInputError } from "apollo-server"
import { combineResolvers } from "graphql-resolvers"
import { isEmpty } from "ramda"
import { isAdmin } from "../../_shared/auth"
import { checkMissing, checkLength } from "../../_shared/input"

const createEventCat = combineResolvers(
  isAdmin,
  async (_, { eventCatInput }, { mongo: { EventCats } }) => {
    let validationErrors = {}
    validationErrors = checkMissing(validationErrors, "name", eventCatInput)
    validationErrors = checkLength(validationErrors, "name", { min: 2, max: 40 }, eventCatInput)
    // vErrors = checkLength(vErrors, "name", 2, eventCatInput)
    if (!isEmpty(validationErrors)) {
      throw new UserInputError("Failed to create event category.", { validationErrors })
    }
    const eventCat = eventCatInput
    const response = await EventCats.insertOne(eventCat)
    eventCat._id = response.insertedId
    return eventCat
  },
)

export default createEventCat
