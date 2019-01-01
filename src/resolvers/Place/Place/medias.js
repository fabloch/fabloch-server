const medias = async (place, args, { mongo: { Medias } }) =>
  Medias.find({
    parentId: place._id,
    parentCollection: "Places",
  })
    .sort({ rank: 1 })
    .toArray()

export default medias
