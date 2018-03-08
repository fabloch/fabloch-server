const intro = async (eventSession, { mongo: { EventModels } }) => {
  if (eventSession.intro) {
    return eventSession.intro
  }
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  if (eventModel.intro) {
    return eventModel.intro
  }
  return null
}

export default intro
