import { ForbiddenError } from "apollo-server"
import { combineResolvers, skip } from "graphql-resolvers"

export const hasRole = (role, user) => {
  if (user.roles && user.roles.indexOf(role) > -1) {
    return true
  }
  return false
}

export const isOwnerOrAdmin = ({ ownerId }, user) => {
  if (ownerId.toString() === user._id.toString()) {
    return skip
  }
  if (hasRole("admin", user)) {
    return skip
  }
  throw new ForbiddenError("Not owner or admin.")
}

export const isAuthenticated = (parent, args, { user }) => {
  if (user) {
    return skip
  }
  throw new ForbiddenError("Not authenticated.")
}

export const isAdmin = combineResolvers(isAuthenticated, (parent, args, { user }) => {
  if (hasRole("admin", user)) {
    return skip
  }
  throw new ForbiddenError("Not authenticated as admin.")
})

export const isOwner = combineResolvers(isAuthenticated, (parent, args, { user }) => {
  if (args.ownerId.toString() === user._id.toString()) {
    return skip
  }
  return new ForbiddenError("Not owner.")
})
