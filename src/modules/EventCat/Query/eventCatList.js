const eventCatList = async (data, { mongo: { EventCats } }) =>
  EventCats.find({}).sort({ name: 1 }).toArray()

export default eventCatList
