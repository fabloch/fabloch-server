const place = async (event, { mongo: { Places } }) =>
  Places.findOne({ _id: event.placeId })

export default place
