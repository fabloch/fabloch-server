import { GraphQLDate, GraphQLDateTime } from "graphql-iso-date"
import { GraphQLEmailAddress, GraphQLURL } from "graphql-scalars"
import GraphQLJSON from "graphql-type-json"

export default {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Email: GraphQLEmailAddress,
  JSON: GraphQLJSON,
  Parent: {
    __resolveType: (parent) => {
      if (parent.start) { return "EventSession" }
      if (parent.city) { return "Place" }
      return "EventModel"
    },
  },
}
