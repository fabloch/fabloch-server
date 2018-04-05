const speaker = async (eventSession, { mongo: { Users } }) =>
  Users.findOne({ _id: eventSession.speakerId })

export default speaker
