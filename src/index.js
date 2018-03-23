import "babel-polyfill"
import express from "express"
import bodyParser from "body-parser"
import { graphqlExpress, graphiqlExpress } from "apollo-server-express"
import { execute, subscribe } from "graphql"
import { createServer } from "http"
import { SubscriptionServer } from "subscriptions-transport-ws"
import expressJwt from "express-jwt"
import jwt from "jsonwebtoken"
import cors from "cors"

import { CORS_URI, JWT_SECRET, PORT, WEBSOCKET_ENDPOINT } from "./utils/config"
import authenticate from "./utils/authenticate"
import formatError from "./utils/formatError"
import connectMongo from "./connectors/mongo-connector"
import mailer from "./mailer"
import buildDataLoaders from "./dataloaders"
import schema from "./schema"

const start = async () => {
  const mongo = await connectMongo()
  const app = express()

  app.use(cors({ origin: CORS_URI }))

  // latency simultation middleware
  app.use((req, res, next) => setTimeout(next, 300))

  const buildOptions = async (req) => {
    const user = await authenticate(req, mongo.Users)
    return {
      context: {
        dataloaders: buildDataLoaders(mongo),
        mongo,
        mailer,
        user,
      },
      formatError,
      schema,
    }
  }
  app.use(
    "/graphql",
    bodyParser.json(),
    expressJwt({
      secret: JWT_SECRET,
      credentialsRequired: false,
    }),
    graphqlExpress(buildOptions),
  )

  // TODO Remove from production!!!
  app.use("/graphiql", graphiqlExpress({
    endpointURL: "/graphql",
    passHeader: `'Authorization': 'bearer ${process.env.USER1_JWT}'`,
    subscriptionsEndpoint: WEBSOCKET_ENDPOINT,
  }))

  const server = createServer(app)
  server.listen(PORT, () => {
    SubscriptionServer.create(
      {
        execute,
        subscribe,
        schema,
        onOperation: (message, params) => ({ ...params, context: { mongo } }),
        onConnect: async (connectionParams) => {
          if (connectionParams.authToken) {
            const payload = jwt.verify(connectionParams.authToken, JWT_SECRET)
            const wsUser = await mongo.Users.findOne({ email: payload.email })
            return ({ wsUser })
          }
          return true
        },
      },
      { server, path: "/subscriptions" },
    )
    console.log(`La Fabrique du Loch's GraphQL server running on port ${PORT}.`) // eslint-disable-line no-console
  })
}

start()
