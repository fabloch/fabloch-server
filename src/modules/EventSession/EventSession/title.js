const title = async (eventSession, { mongo: { EventModels } }) => {
  if (eventSession.title) {
    return eventSession.title
  }
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  if (eventModel.title) {
    return eventModel.title
  }
  return null
}

export default title
