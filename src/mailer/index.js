import Mailgun from "mailgun-js"
import { MAILGUN_KEY as apiKey, MAILGUN_DOMAIN as domain } from "../utils/config"

const mailer = async (data) => {
  // data: { from, to, subject, html }
  const mailgun = new Mailgun({ apiKey, domain })
  try {
    const response = await mailgun.messages().send(data)
    console.log(response) // eslint-disable-line no-console
  } catch (e) {
    console.log(e.message) // eslint-disable-line no-console
  }
}

export default mailer
