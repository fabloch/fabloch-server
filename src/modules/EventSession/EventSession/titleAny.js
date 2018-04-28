const titleAny = async (eventSession, { mongo: { EventModels } }) => {
  if (eventSession.title) { return eventSession.title }
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  return eventModel.title
}

export default titleAny
