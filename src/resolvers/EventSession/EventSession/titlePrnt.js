const titlePrnt = async (eventSession, _, { mongo: { EventModels } }) => {
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  return eventModel.title
}

export default titlePrnt
