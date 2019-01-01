import { createServer } from "http"
import express from "express"
import { ApolloServer, AuthenticationError } from "apollo-server-express"
import expressJwt from "express-jwt"
// import jwt from "jsonwebtoken"
import cors from "cors"
// import DataLoader from "dataloader"

import {
  CORS_URI,
  MONGO_URL,
  MONGO_DB_NAME,
  JWT_SECRET,
  PORT,
  TEST_MONGO_URL,
  TEST_MONGO_DB_NAME,
  TEST_PORT,
} from "./utils/config"

import getMe from "./utils/getMe"
import connectMongo from "./connectors/mongo-connector"
import schema from "./schema"
import resolvers from "./resolvers"
// import loaders from "./loaders"
// import mailer from "./mailer"

const [port, uri, dbName, serverType] = process.env.TEST
  ? [TEST_PORT, TEST_MONGO_URL, TEST_MONGO_DB_NAME, "test"]
  : [PORT, MONGO_URL, MONGO_DB_NAME, "dev"]

const app = express()

app.use(cors({ origin: CORS_URI }))

// latency simultation middleware
app.use((req, res, next) => setTimeout(next, 300))

app.use(
  expressJwt({
    secret: JWT_SECRET,
    credentialsRequired: false,
  }),
)

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        mongo: await connectMongo(uri, dbName),
        loaders: {},
      }
    }

    if (req) {
      return {
        mongo: await connectMongo(uri, dbName),
        user: req.user,
        secret: JWT_SECRET,
        loaders: {},
      }
    }
  },
})

server.applyMiddleware({ app, path: "/graphql" })

const httpServer = createServer(app)
server.installSubscriptionHandlers(httpServer)

// eslint-disable-next-line
app.listen({ port }, () =>
  console.log(`🚀 Apollo ${serverType} Server ready at http://localhost:${port}`),
)
