const speaker = async (eventModel, { mongo: { Users } }) =>
  Users.findOne({ _id: eventModel.speakerId })

export default speaker
