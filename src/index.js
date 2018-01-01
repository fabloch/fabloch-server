import "babel-polyfill"
import express from "express"
import bodyParser from "body-parser"
import { graphqlExpress, graphiqlExpress } from "apollo-server-express"
import { execute, subscribe } from "graphql"
import { createServer } from "http"
import { SubscriptionServer } from "subscriptions-transport-ws"
import jwt from "express-jwt"
import cors from "cors"

import { CORS_URI, JWT_SECRET, PORT } from "./utils/config"
import authenticate from "./utils/authenticate"
import formatError from "./utils/formatError"
import connectMongo from "./connectors/mongo-connector"
import buildDataLoaders from "./dataloaders"
import schema from "./schema"

const start = async () => {
  const mongo = await connectMongo()
  const app = express()

  app.use(cors({ origin: CORS_URI }))

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
    "/graphql",
    bodyParser.json(),
    jwt({
      secret: JWT_SECRET,
      credentialsRequired: false,
    }),
    graphqlExpress(buildOptions),
  )

  // TODO Remove from production!!!
  app.use("/graphiql", graphiqlExpress({
    endpointURL: "/graphql",
    // passHeader: "'Authorization': 'bearer token-test.idis@icloud.com'",
    subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
  }))

  const server = createServer(app)
  server.listen(PORT, () => {
    SubscriptionServer.create(
      { execute, subscribe, schema },
      { server, path: "/subscriptions" },
    )
    console.log(`La Fabrique du Loch's GraphQL server running on port ${PORT}.`) // eslint-disable-line no-console
  })
}

start()
