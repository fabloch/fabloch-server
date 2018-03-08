const mainMedia = async (place, { mongo: { Medias } }) =>
  Medias.findOne({
    parentId: place._id,
    parentCollection: "Places",
    rank: 0,
  })

export default mainMedia
