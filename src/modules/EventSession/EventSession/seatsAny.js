const seatsAny = async (eventSession, { mongo: { EventModels } }) => {
  if (eventSession.seats) { return eventSession.seats }
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  return eventModel.seats
}

export default seatsAny
