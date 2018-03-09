const eventCats = async (eventSession, { mongo: { EventModels } }) => {
  const eventModel = await EventModels.findOne({ _id: eventSession.eventModelId })
  const emec = eventModel.eventCats || []
  const esec = eventSession.eventCatsSuper || []
  const all = [...emec, ...esec]

  return all
}

export default eventCats
