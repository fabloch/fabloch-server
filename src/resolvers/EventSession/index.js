import pubsub from "../../utils/pubsub"

import titlePrnt from "./EventSession/titlePrnt"
import introPrnt from "./EventSession/introPrnt"
import descriptionPrnt from "./EventSession/descriptionPrnt"
import seatsPrnt from "./EventSession/seatsPrnt"
import mediasPrnt from "./EventSession/mediasPrnt"
import placePrnt from "./EventSession/placePrnt"
import speakerPrnt from "./EventSession/speakerPrnt"
import eventCatsPrnt from "./EventSession/eventCatsPrnt"

import titleAny from "./EventSession/titleAny"
import introAny from "./EventSession/introAny"
import descriptionAny from "./EventSession/descriptionAny"
import seatsAny from "./EventSession/seatsAny"
import mediasAny from "./EventSession/mediasAny"
import placeAny from "./EventSession/placeAny"
import speakerAny from "./EventSession/speakerAny"
import eventCatsAny from "./EventSession/eventCatsAny"

import mainMedia from "./EventSession/mainMedia"
import medias from "./EventSession/medias"
import place from "./EventSession/place"
import speaker from "./EventSession/speaker"
import eventCats from "./EventSession/eventCats"
import userStatus from "./EventSession/userStatus"
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
    eventCatSessionList,
    eventModelSessionList,
    eventSessionList,
    eventSessionDetail,
  },
  Mutation: {
    createEventSession,
    deleteEventSession,
    updateEventSession,
  },
  Subscription: {
    EventSession: {
      // subscribe: (_, __, { wsUser }) => pubsub.asyncIterator("EventSession"),
      subscribe: () => pubsub.asyncIterator("EventSession"),
    },
  },
  EventSession: {
    id: eventSession => eventSession._id.toString(),
    isSession: () => true,
    place,
    speaker,
    eventCats,

    userStatus,
    mainMedia,
    medias,
    model,
    owner: async (eventSession, _, { mongo: { Users } }) =>
      Users.findOne({ _id: eventSession.ownerId }),
    ticketCount,
    tickets,

    titlePrnt,
    introPrnt,
    descriptionPrnt,
    seatsPrnt,
    placePrnt,
    speakerPrnt,
    eventCatsPrnt,
    mediasPrnt,

    titleAny,
    introAny,
    descriptionAny,
    seatsAny,
    placeAny,
    speakerAny,
    eventCatsAny,
    mediasAny,
  },
}
