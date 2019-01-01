const parent = async (media, args, { mongo: { EventModels, EventSessions, Places } }) => {
  switch (media.parentCollection) {
    case "EventModels":
      return EventModels.findOne({ _id: media.parentId })
    case "EventSessions":
      return EventSessions.findOne({ _id: media.parentId })
    case "Places":
      return Places.findOne({ _id: media.parentId })
    default:
      return false
  }
}

export default parent
