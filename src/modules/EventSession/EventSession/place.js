const place = async (eventSession, { mongo: { Places, EventModels } }) => {
  const eventSessionPlace = await Places.findOne({ _id: eventSession.placeId })
  if (eventSessionPlace) {
    return eventSessionPlace
  }
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  const eventModelPlace = await Places.findOne({ _id: eventModel.placeId })
  if (eventModelPlace) {
    return eventModelPlace
  }
  return null
}

export default place
