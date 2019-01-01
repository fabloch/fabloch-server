import { ObjectId } from "mongodb"
import { UserInputError } from "apollo-server"
import { combineResolvers } from "graphql-resolvers"
import { isEmpty } from "ramda"
import { isAdmin } from "../../_shared/auth"
import { checkMissing, checkLength } from "../../_shared/input"

const updateEventCat = combineResolvers(
  isAdmin,
  async (parent, { eventCatInput }, { mongo: { EventCats, EventModels, EventSessions } }) => {
    let validationErrors = {}
    validationErrors = checkMissing(validationErrors, "name", eventCatInput)
    validationErrors = checkLength(validationErrors, "name", { min: 2, max: 40 }, eventCatInput)
    if (!isEmpty(validationErrors)) {
      throw new UserInputError("Failed to update event category.", { validationErrors })
    }

    const _id = ObjectId(eventCatInput.id)
    const eventCatFromDb = await EventCats.findOne({ _id })
    const updatedEventCat = {
      ...eventCatFromDb,
      name: eventCatInput.name,
      color: eventCatInput.color,
    }
    await EventCats.updateOne(eventCatFromDb, { $set: updatedEventCat })

    await EventModels.updateMany(
      { "eventCats.id": _id },
      {
        $set: { "eventCats.$.name": eventCatInput.name, "eventCats.$.color": eventCatInput.color },
      },
    )
    await EventSessions.updateMany(
      { "eventCats.id": _id },
      {
        $set: { "eventCats.$.name": eventCatInput.name, "eventCats.$.color": eventCatInput.color },
      },
    )

    return updatedEventCat
  },
)

export default updateEventCat
