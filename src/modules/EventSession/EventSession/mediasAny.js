const mediasAny = async (eventSession, { mongo: { Medias } }) => {
  const esMediaPromise = Medias.find({
    parentId: eventSession._id,
    parentCollection: "EventSessions",
  }).sort({ rank: 1 }).toArray()
  const emMediaPromise = Medias.find({
    parentId: eventSession.eventModelId,
    parentCollection: "EventModels",
  }).sort({ rank: 1 }).toArray()
  const result = await Promise.all([esMediaPromise, emMediaPromise])
  return [...result[0], ...result[1]]
}

export default mediasAny
