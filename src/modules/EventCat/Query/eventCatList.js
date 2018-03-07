const eventCatList = async (data, { mongo: { EventCats } }) =>
  EventCats.find({}).toArray()

export default eventCatList
