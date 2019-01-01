import { GraphQLDate, GraphQLDateTime } from "graphql-iso-date"
import { GraphQLEmailAddress } from "graphql-scalars"
import GraphQLJSON from "graphql-type-json"

const customScalars = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Email: GraphQLEmailAddress,
  JSON: GraphQLJSON,
  Parent: {
    __resolveType: parent => {
      if (parent.start) {
        return "EventSession"
      }
      if (parent.city) {
        return "Place"
      }
      return "EventModel"
    },
  },
}

export default customScalars
