import { ObjectId } from 'mongodb'

export const admin = {
  _id: ObjectId('5a383f36d2834c317755ab17'),
  name: 'Admin',
  email: 'admin@example.com',
  password: '$2a$10$Htm2b52NAP2XE5pD8LnK2OP58PTf9kXxaEtKxMmbI28Udappwayy6',
  version: 1,
}
export const userData = [
  {
    _id: ObjectId('5a31b456c5e7b54a9aba3782'),
    name: 'Seb Idis',
    email: 'user@example.com',
    password: '$2a$10$Htm2b52NAP2XE5pD8LnK2OP58PTf9kXxaEtKxMmbI28Udappwayy6',
    version: 1,
  },
  {
    _id: ObjectId('5a31b4efedc7474b9addc261'),
    name: 'Hack Idis',
    email: 'hack.idis@icloud.com',
    password: '$2a$10$AyhLbNMCe6bIAKWOI/1PjOs6/wvQPnj6kQBRO4/PzjR8Jbb7bTHey',
    version: 1,
  },
]

export const memberships = []
