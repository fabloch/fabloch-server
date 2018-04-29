const speakerAny = async (eventSession, { mongo: { Users, EventModels } }) => {
  if (eventSession.speakerId) { return Users.findOne({ _id: eventSession.speakerId }) }

  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  const eventModelSpeaker = await Users.findOne({ _id: eventModel.speakerId })
  return eventModelSpeaker
}

export default speakerAny
