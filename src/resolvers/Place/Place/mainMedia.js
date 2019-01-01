const mainMedia = async (place, args, { mongo: { Medias } }) =>
  Medias.findOne({
    parentId: place._id,
    parentCollection: "Places",
    rank: 0,
  })

export default mainMedia
