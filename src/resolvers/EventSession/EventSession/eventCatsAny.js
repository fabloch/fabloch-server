import { union, sortBy } from "lodash"

const eventCatsAny = async (eventSession, _, { mongo: { EventModels } }) => {
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  const esEventCats = eventSession.eventCats
  const emEventCats = eventModel.eventCats
  const eventCats = sortBy(union(esEventCats, emEventCats), ec => ec.name)
  return eventCats
}

export default eventCatsAny
