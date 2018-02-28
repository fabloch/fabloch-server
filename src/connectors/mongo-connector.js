import { Logger, MongoClient } from "mongodb"
import { MONGODB_URI } from "../utils/config"

export default async function () {
  const db = await MongoClient.connect(MONGODB_URI)

  // let logCount = 0
  // Logger.setCurrentLogger((msg) => {
  //   // eslint-disable-next-line no-console
  //   console.log(`MONGO DB REQUEST ${logCount += 1}: ${msg})`)
  // })
  // Logger.setLevel("debug")
  // Logger.filter("class", ["Cursor"])

  return {
    EventModels: db.collection("eventModels"),
    EventSessions: db.collection("eventSessions"),
    EventTickets: db.collection("eventTickets"),
    Media: db.collection("medias"),
    Memberships: db.collection("memberships"),
    Newcomers: db.collection("newcomers"),
    Places: db.collection("places"),
    Users: db.collection("users"),
  }
}
