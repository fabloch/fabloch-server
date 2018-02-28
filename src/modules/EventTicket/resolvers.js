import saveEventTicket from "./Mutation/saveEventTicket"

export default {
  Mutation: {
    saveEventTicket: async (_, data, context) => saveEventTicket(data, context),
  },
  EventTicket: {
    id: eventTicket => eventTicket._id.toString(),
    owner: async (eventTicket, _, { mongo: { Users } }) => (
      Users.findOne({ _id: eventTicket.ownerId })
    ),
    eventModel: async (eventTicket, _, { mongo: { EventModels } }) => (
      EventModels.findOne({ _id: eventTicket.eventModelId })
    ),
  },
}
