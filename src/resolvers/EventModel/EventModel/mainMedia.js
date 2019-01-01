const mainMedia = async (eventModel, { mongo: { Medias } }) =>
  Medias.findOne({
    parentId: eventModel._id,
    parentCollection: "EventModels",
    rank: 0,
  })

export default mainMedia
