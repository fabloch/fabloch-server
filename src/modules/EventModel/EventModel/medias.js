const medias = async (eventModel, { mongo: { Medias } }) =>
  Medias.find({
    parentId: eventModel._id,
    parentCollection: "EventModels",
  }).sort({ rank: 1 }).toArray()

export default medias
