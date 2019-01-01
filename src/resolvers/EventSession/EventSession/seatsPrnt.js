const seatsPrnt = async (eventSession, _, { mongo: { EventModels } }) => {
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  return eventModel.seats || null
}

export default seatsPrnt
