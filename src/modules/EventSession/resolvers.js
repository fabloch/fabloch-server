import pubsub from "../../utils/pubsub"

import titlePrnt from "./EventSession/titlePrnt"
import introPrnt from "./EventSession/introPrnt"
import descriptionPrnt from "./EventSession/descriptionPrnt"
import seatsPrnt from "./EventSession/seatsPrnt"
import placePrnt from "./EventSession/placePrnt"
import speakerPrnt from "./EventSession/speakerPrnt"
import eventCatsPrnt from "./EventSession/eventCatsPrnt"

import titleAny from "./EventSession/titleAny"
import introAny from "./EventSession/introAny"
import descriptionAny from "./EventSession/descriptionAny"
import seatsAny from "./EventSession/seatsAny"
import placeAny from "./EventSession/placeAny"
import speakerAny from "./EventSession/speakerAny"
import eventCatsAny from "./EventSession/eventCatsAny"

import place from "./EventSession/place"
import speaker from "./EventSession/speaker"
import eventCats from "./EventSession/eventCats"
import userStatus from "./EventSession/userStatus"
import mainMedia from "./EventSession/mainMedia"
import medias from "./EventSession/medias"
import model from "./EventSession/model"
import ticketCount from "./EventSession/ticketCount"
import tickets from "./EventSession/tickets"

import eventCatSessionList from "./Query/eventCatSessionList"
import eventModelSessionList from "./Query/eventModelSessionList"
import eventSessionList from "./Query/eventSessionList"
import eventSessionDetail from "./Query/eventSessionDetail"

import createEventSession from "./Mutation/createEventSession"
import deleteEventSession from "./Mutation/deleteEventSession"
import updateEventSession from "./Mutation/updateEventSession"

export default {
  Query: {
    eventCatSessionList: async (_, data, context) => eventCatSessionList(data, context),
    eventModelSessionList: async (_, data, context) => eventModelSessionList(data, context),
    eventSessionList: async (_, data, context) => eventSessionList(data, context),
    eventSessionDetail: async (_, data, context) => eventSessionDetail(data, context),
  },
  Mutation: {
    createEventSession: async (_, data, context) => createEventSession(data, context),
    deleteEventSession: async (_, data, context) => deleteEventSession(data, context),
    updateEventSession: async (_, data, context) => updateEventSession(data, context),
  },
  Subscription: {
    EventSession: {
      // subscribe: (_, __, { wsUser }) => pubsub.asyncIterator("EventSession"),
      subscribe: () => pubsub.asyncIterator("EventSession"),
    },
  },
  EventSession: {
    id: eventSession => eventSession._id.toString(),
    place: async (eventSession, _, context) => place(eventSession, context),
    speaker: async (eventSession, _, context) => speaker(eventSession, context),
    eventCats: async (eventSession, _, context) => eventCats(eventSession, context),

    userStatus: async (eventSession, _, context) => userStatus(eventSession, context),
    mainMedia: async (eventSession, _, context) => mainMedia(eventSession, context),
    medias: async (eventSession, _, context) => medias(eventSession, context),
    model: async (eventSession, _, context) => model(eventSession, context),
    owner: async (eventSession, _, { mongo: { Users } }) =>
      Users.findOne({ _id: eventSession.ownerId }),
    ticketCount: async (eventSession, _, context) => ticketCount(eventSession, context),
    tickets: async (eventSession, _, context) => tickets(eventSession, context),

    titlePrnt: async (eventSession, _, context) => titlePrnt(eventSession, context),
    introPrnt: async (eventSession, _, context) => introPrnt(eventSession, context),
    descriptionPrnt: async (eventSession, _, context) => descriptionPrnt(eventSession, context),
    seatsPrnt: async (eventSession, _, context) => seatsPrnt(eventSession, context),
    placePrnt: async (eventSession, _, context) => placePrnt(eventSession, context),
    speakerPrnt: async (eventSession, _, context) => speakerPrnt(eventSession, context),
    eventCatsPrnt: async (eventSession, _, context) => eventCatsPrnt(eventSession, context),

    titleAny: async (eventSession, _, context) => titleAny(eventSession, context),
    introAny: async (eventSession, _, context) => introAny(eventSession, context),
    descriptionAny: async (eventSession, _, context) => descriptionAny(eventSession, context),
    seatsAny: async (eventSession, _, context) => seatsAny(eventSession, context),
    placeAny: async (eventSession, _, context) => placeAny(eventSession, context),
    speakerAny: async (eventSession, _, context) => speakerAny(eventSession, context),
    eventCatsAny: async (eventSession, _, context) => eventCatsAny(eventSession, context),
  },
}
