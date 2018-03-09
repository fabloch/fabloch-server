const seats = async (eventSession, { mongo: { EventModels } }) => {
  if (eventSession.seatsSuper) {
    return eventSession.seatsSuper
  }
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  if (eventModel.seats) {
    return eventModel.seats
  }
  return null
}

export default seats
