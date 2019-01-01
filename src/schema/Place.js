import { gql } from "apollo-server-express"

export default gql`
  type Place {
    id: ID!
    mainMedia: Media
    title: String!
    titleAny: String
    medias: [Media!]!
    street1: String
    street2: String
    zipCode: String!
    city: String!
    country: String!
    stateProvince: String
    published: Boolean
    lat: Float!
    lng: Float!
  }

  extend type Query {
    placeList(all: Boolean): [Place!]!
    placeDetail(id: ID!): Place!
  }

  extend type Mutation {
    createPlace(placeInput: CreatePlaceInput): Place!
    deletePlace(placeId: ID!): Boolean
    updatePlace(placeInput: UpdatePlaceInput): Place!
  }
  input CreatePlaceInput {
    title: String!
    street1: String!
    street2: String
    zipCode: String!
    city: String!
    country: String!
    stateProvince: String
    published: Boolean!
    lat: Float!
    lng: Float!
  }
  input UpdatePlaceInput {
    id: ID!
    title: String!
    street1: String!
    street2: String
    zipCode: String!
    city: String!
    country: String!
    stateProvince: String
    published: Boolean!
    lat: Float!
    lng: Float!
  }
`
