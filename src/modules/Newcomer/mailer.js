import { CLIENT_URI } from "../../utils/config"

// eslint-disable-next-line import/prefer-default-export
export const sendNewcomerDigits = async (newcomer, mailer) => {
  const data = {
    to: newcomer.email,
    from: "sebastien@sifnos.io",
    subject: "La FABrique du Loch : voici votre code pour activer votre compte",
    CORS_URI: "defined in .env",
    html: `<p>Votre code est :</p><h1>${newcomer.digits}</h1><p>Pour continuer votre inscription, <a href='${CLIENT_URI}/inscription/${newcomer.id}'>renseignez-le sur cette page</a>`,
  }
  await mailer(data)
}
