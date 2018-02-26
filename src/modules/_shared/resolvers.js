import { GraphQLDate, GraphQLDateTime } from "graphql-iso-date"
import { GraphQLEmailAddress, GraphQLURL } from "graphql-scalars"
import GraphQLJSON from "graphql-type-json"

export default {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Email: GraphQLEmailAddress,
  Url: GraphQLURL,
  JSON: GraphQLJSON,
}
