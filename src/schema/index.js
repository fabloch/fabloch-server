import { makeExecutableSchema } from "graphql-tools"
import typeDefs from "./typeDefs"
import resolvers from "./resolvers"

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})

// TODO: ModelType with createdAt, updatedAt, id
