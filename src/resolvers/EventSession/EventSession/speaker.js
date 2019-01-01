const speaker = async (eventSession, _, { mongo: { Users } }) =>
  Users.findOne({ _id: eventSession.speakerId })

export default speaker
