const description = async (eventSession, { mongo: { EventModels } }) => {
  if (eventSession.description) {
    return eventSession.description
  }
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  if (eventModel.description) {
    return eventModel.description
  }
  return null
}

export default description
