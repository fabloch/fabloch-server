const model = async (eventSession, _, { mongo: { EventModels } }) =>
  EventModels.findOne({ _id: eventSession.eventModelId })

export default model
