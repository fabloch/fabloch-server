const place = async (eventModel, { mongo: { Places } }) =>
  Places.findOne({ _id: eventModel.placeId })

export default place
