import { makeExecutableSchema } from 'graphql-tools'
import resolvers from '../resolvers'

import Query from './typeDefs/Query'
import Mutation from './typeDefs/Mutation'
import Subscription from './typeDefs/Subscription'
import Link from './typeDefs/Link'
import User from './typeDefs/User'
import Vote from './typeDefs/Vote'

const schema = makeExecutableSchema({
  typeDefs: [
    Query,
    Mutation,
    Subscription,
    Link,
    User,
    Vote,
  ],
  resolvers,
})

export default schema
