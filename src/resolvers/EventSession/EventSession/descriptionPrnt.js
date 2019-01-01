const descriptionPrnt = async (eventSession, _, { mongo: { EventModels } }) => {
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  return eventModel.description
}

export default descriptionPrnt
