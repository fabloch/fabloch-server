const introAny = async (eventSession, _, { mongo: { EventModels } }) => {
  if (eventSession.intro) {
    return eventSession.intro
  }
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  return eventModel.intro
}

export default introAny
