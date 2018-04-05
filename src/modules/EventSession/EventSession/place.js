const place = async (eventSession, { mongo: { Places } }) =>
  Places.findOne({ _id: eventSession.placeId })

export default place
