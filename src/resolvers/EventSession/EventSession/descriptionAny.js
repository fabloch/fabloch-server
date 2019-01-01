const descriptionAny = async (eventSession, _, { mongo: { EventModels } }) => {
  if (eventSession.description) {
    return eventSession.description
  }
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  return eventModel.description
}

export default descriptionAny
