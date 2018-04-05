const speaker = async (eventSession, { mongo: { Users, EventModels } }) => {
  const eventSessionSpeaker = await Users.findOne({ _id: eventSession.speakerSuperId })
  if (eventSessionSpeaker) {
    return eventSessionSpeaker
  }
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  const eventModelSpeaker = await Users.findOne({ _id: eventModel.speakerId })
  if (eventModelSpeaker) {
    return eventModelSpeaker
  }
  return null
}

export default speaker
