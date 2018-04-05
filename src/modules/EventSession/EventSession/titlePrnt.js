const titlePrnt = async (eventSession, { mongo: { EventModels } }) => {
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  return eventModel.title
}

export default titlePrnt
