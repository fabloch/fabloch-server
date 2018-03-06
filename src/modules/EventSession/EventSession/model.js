const model = async (eventSession, { mongo: { EventModels } }) =>
  EventModels.findOne({ _id: eventSession.eventModelId })

export default model
