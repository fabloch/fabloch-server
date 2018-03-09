import createEventCat from "./Mutation/createEventCat"
import deleteEventCat from "./Mutation/deleteEventCat"
import updateEventCat from "./Mutation/updateEventCat"
import eventCatList from "./Query/eventCatList"

export default {
  Query: {
    eventCatList: async (_, data, context) => eventCatList(data, context),
  },
  Mutation: {
    createEventCat: async (_, data, context) => createEventCat(data, context),
    deleteEventCat: async (_, data, context) => deleteEventCat(data, context),
    updateEventCat: async (_, data, context) => updateEventCat(data, context),
  },
  EventCat: {
    id: (eventCat) => {
      if (eventCat._id) { return eventCat._id.toString() }
      return eventCat.id
    },
  },
}
