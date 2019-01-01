import createEventCat from "./Mutation/createEventCat"
import deleteEventCat from "./Mutation/deleteEventCat"
import updateEventCat from "./Mutation/updateEventCat"
import eventCatList from "./Query/eventCatList"

export default {
  Query: {
    eventCatList,
  },
  Mutation: {
    createEventCat,
    deleteEventCat,
    updateEventCat,
  },
  EventCat: {
    id: eventCat => {
      if (eventCat._id) {
        return eventCat._id.toString()
      }
      return eventCat.id
    },
  },
}
