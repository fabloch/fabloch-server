import createPlace from "./Mutation/createPlace"

export default {
  Mutation: {
    createPlace: async (_, data, context) => createPlace(data, context),
  },
  Place: {
    id: place => place._id.toString(),
  },
}
