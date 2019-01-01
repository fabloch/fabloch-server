import { gql } from "apollo-server-express"

export default gql`
  type UserMembershipData {
    present: Membership
    isMember: Boolean!
    wasMember: Boolean!
    alertLevel: Int!
    nextStart: Date
    nextEnd: Date
    memberships: [Membership!]
  }

  type Membership {
    id: ID!
    owner: User!
    plan: MembershipPlan
    start: Date
    end: Date
    # invoice: Invoice
  }

  enum MembershipPlan {
    PERSO
    PRO
    COMPANY
  }

  input MembershipInput {
    plan: MembershipPlan
    start: Date
    end: Date
  }

  extend type Query {
    userMembershipData: UserMembershipData!
    userMemberships: [Membership!]
  }

  extend type Mutation {
    createMembership(membership: MembershipInput): Membership
  }
`
