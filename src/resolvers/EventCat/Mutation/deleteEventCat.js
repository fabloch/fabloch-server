import { ObjectId } from "mongodb"
import { combineResolvers } from "graphql-resolvers"
import { isAdmin } from "../../_shared/auth"

const deleteEventCat = combineResolvers(
  isAdmin,
  async (parent, { eventCatId }, { mongo: { EventCats, EventModels, EventSessions } }) => {
    const _id = ObjectId(eventCatId)
    await EventCats.remove({ _id })

    // const deletedEventCat = { ...eventCatFromDb, name: eventCatInput.name }
    // await EventCats.delete(eventCatFromDb, deletedEventCat)
    //
    await EventModels.updateMany({ "eventCats.id": _id }, { $pull: { eventCats: { id: _id } } })
    await EventSessions.updateMany({ "eventCats.id": _id }, { $pull: { eventCats: { id: _id } } })

    return true
  },
)

export default deleteEventCat
