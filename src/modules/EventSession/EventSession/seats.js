const seats = async (eventSession, { mongo: { EventModels } }) => {
  if (eventSession.seats) {
    return eventSession.seats
  }
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  if (eventModel.seats) {
    return eventModel.seats
  }
  return null
}

export default seats
