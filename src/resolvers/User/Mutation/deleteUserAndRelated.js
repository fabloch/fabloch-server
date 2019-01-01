import { ObjectId } from "mongodb"

const deleteUserAndRelated = async (userId, { mongo: { Users, EventTickets } }) => {
  const _id = ObjectId(userId)
  const userPromise = Users.remove({ _id })
  const ticketPromise = EventTickets.remove({ ownerId: _id })
  await Promise.all([userPromise, ticketPromise])

  return true
}

export default deleteUserAndRelated
