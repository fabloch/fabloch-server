const medias = async (eventSession, { mongo: { Medias } }) =>
  Medias.find({
    parentId: eventSession._id,
    parentCollection: "EventSessions",
  }).sort({ rank: 1 }).toArray()

export default medias
