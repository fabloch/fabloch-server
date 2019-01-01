const place = async (eventSession, _, { mongo: { Places } }) =>
  Places.findOne({ _id: eventSession.placeId })

export default place
