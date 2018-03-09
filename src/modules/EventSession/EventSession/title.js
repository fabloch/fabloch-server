const title = async (eventSession, { mongo: { EventModels } }) => {
  if (eventSession.titleSuper) {
    return eventSession.titleSuper
  }
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  if (eventModel.title) {
    return eventModel.title
  }
  return null
}

export default title
