const mainMedia = async (eventSession, _, { mongo: { Medias } }) => {
  let mm
  mm = await Medias.findOne({
    parentId: eventSession._id,
    parentCollection: "EventSessions",
    rank: 0,
  })
  if (!mm) {
    mm = await Medias.findOne({
      parentId: eventSession.eventModelId,
      parentCollection: "EventModels",
      rank: 0,
    })
  }
  return mm
}

export default mainMedia
