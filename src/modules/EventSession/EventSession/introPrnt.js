const introPrnt = async (eventSession, { mongo: { EventModels } }) => {
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  return eventModel.intro
}

export default introPrnt
