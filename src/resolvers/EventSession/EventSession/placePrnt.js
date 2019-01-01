const place = async (eventSession, _, { mongo: { Places, EventModels } }) => {
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  const eventModelPlace = await Places.findOne({ _id: eventModel.placeId })
  return eventModelPlace
}

export default place
