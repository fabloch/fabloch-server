const speakerPrnt = async (eventSession, _, { mongo: { Users, EventModels } }) => {
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  const eventModelSpeaker = await Users.findOne({ _id: eventModel.speakerId })
  return eventModelSpeaker
}

export default speakerPrnt
