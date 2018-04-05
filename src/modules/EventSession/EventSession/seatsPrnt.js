const seatsPrnt = async (eventSession, { mongo: { EventModels } }) => {
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  return eventModel.seats || null
}

export default seatsPrnt
