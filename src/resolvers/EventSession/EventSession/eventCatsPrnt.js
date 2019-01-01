const eventCats = async (eventSession, _, { mongo: { EventModels } }) => {
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  return eventModel.eventCats
}

export default eventCats
