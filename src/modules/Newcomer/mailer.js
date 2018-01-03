import { CLIENT_URI } from "../../utils/config"

// eslint-disable-next-line import/prefer-default-export
export const sendNewcomerDigits = async (newcomer, mailer) => {
  const commonData = {
    to: newcomer.email,
    from: "sebastien@sifnos.io",
    CORS_URI: "defined in .env",
  }
  const firstDelivery = {
    subject: "La FABrique du Loch : voici votre code pour activer votre compte",
    html: `<p>Votre code est :</p><h1>${newcomer.digits}</h1><p>Pour continuer votre inscription, <a href='${CLIENT_URI}/inscription/${newcomer.id}'>renseignez-le sur cette page</a></p>`,
  }
  const nextDeliveries = {
    subject: "La FABrique du Loch : votre nouveau code pour activer votre compte",
    html: `<p>Votre nouveau code est :</p><h1>${newcomer.digits}</h1><p>Pour continuer votre inscription, <a href='${CLIENT_URI}/inscription/${newcomer.id}'>renseignez-le sur cette page</a></p><p><em>Ne tenez pas compte des emails précédents</em></p>`,
  }
  const data = () => {
    if (newcomer.resent) {
      return {
        ...commonData,
        ...nextDeliveries,
      }
    }
    return {
      ...commonData,
      ...firstDelivery,
    }
  }
  await mailer(data())
}
