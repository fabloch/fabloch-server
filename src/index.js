import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { execute, subscribe } from 'graphql'
import { createServer } from 'http'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import jwt from 'express-jwt'

import { JWT_SECRET } from './config'
import authenticate from './authenticate'
import connectMongo from './db/mongo-connector'
import buildDataLoaders from './data/dataloaders'
import schema from './data/schema'
import formatError from './formatError'

const start = async () => {
  const mongo = await connectMongo()
  const app = express()

  const buildOptions = async (req) => {
    const user = await authenticate(req, mongo.Users)
    return {
      context: {
        dataloaders: buildDataLoaders(mongo),
        mongo,
        user,
      },
      formatError,
      schema,
    }
  }
  app.use(
    '/graphql',
    bodyParser.json(),
    jwt({
      secret: JWT_SECRET,
      credentialsRequired: false,
    }),
    graphqlExpress(buildOptions),
  )

  const PORT = 3000
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    // passHeader: "'Authorization': 'bearer token-test.idis@icloud.com'",
    subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
  }))

  const server = createServer(app)
  server.listen(PORT, () => {
    SubscriptionServer.create(
      { execute, subscribe, schema },
      { server, path: '/subscriptions' },
    )
    console.log(`La Fabrique du Loch's GraphQL server running on port ${PORT}.`) // eslint-disable-line no-console
  })
}

start()
