import { gql } from "apollo-server-express"

export default gql`
  type Media {
    id: ID!
    title: String
    picUrl: String
    sourceUrl: String
    category: MediaCategory!
    parentId: ID!
    parentCollection: ParentCollection!
    parent: Parent
    rank: Int!
  }

  union Parent = EventModel | EventSession | Place

  extend type Query {
    mediaList: [Media!]!
  }
  extend type Mutation {
    saveMedia(mediaInput: SaveMediaInput): Media!
    deleteMedia(mediaId: ID!): Boolean!
  }

  input SaveMediaInput {
    id: ID
    title: String
    picUrl: String
    sourceUrl: String
    category: MediaCategory!
    parentId: ID!
    parentCollection: ParentCollection!
    rank: Int!
  }

  enum MediaCategory {
    IMAGE
    LINK
    YOUTUBE
  }

  enum ParentCollection {
    EventModels
    EventSessions
    Places
  }
`
