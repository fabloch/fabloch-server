const placeAny = async (eventSession, _, { mongo: { Places, EventModels } }) => {
  if (eventSession.placeId) {
    return Places.findOne({ _id: eventSession.placeId })
  }

  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  const eventModelSpeaker = await Places.findOne({ _id: eventModel.placeId })
  return eventModelSpeaker
}

export default placeAny
