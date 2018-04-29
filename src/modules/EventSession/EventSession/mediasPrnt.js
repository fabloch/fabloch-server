const mediasPrnt = async (eventSession, { mongo: { Medias } }) => 
  Medias.find({
    parentId: eventSession.eventModelId,
    parentCollection: "EventModels",
  }).sort({ rank: 1 }).toArray()

export default mediasPrnt
