import { MongoClient } from "mongodb"
// import { Logger, MongoClient } from "mongodb"

export default async function(url, dbName) {
  try {
    const client = await MongoClient.connect(
      url,
      { useNewUrlParser: true },
    )

    // let logCount = 0
    // Logger.setCurrentLogger((msg) => {
    //   // eslint-disable-next-line no-console
    //   console.log(`MONGO DB REQUEST ${logCount += 1}: ${msg})`)
    // })
    // Logger.setLevel("debug")
    // Logger.filter("class", ["Cursor"])
    //
    const db = client.db(dbName)
    return {
      EventModels: db.collection("eventModels"),
      EventSessions: db.collection("eventSessions"),
      EventTickets: db.collection("eventTickets"),
      Medias: db.collection("medias"),
      Memberships: db.collection("memberships"),
      Newcomers: db.collection("newcomers"),
      Places: db.collection("places"),
      EventCats: db.collection("eventCats"),
      Users: db.collection("users"),
    }
  } catch (error) {
    console.log(error)
  }
}
