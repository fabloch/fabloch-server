const eventCatList = async (parent, args, { mongo: { EventCats } }) =>
  EventCats.find({})
    .sort({ name: 1 })
    .toArray()

export default eventCatList
