import { CLIENT_URI } from "../../utils/config"

// eslint-disable-next-line import/prefer-default-export
export const sendNewcomerDigits = async (newcomer, mailer) => {
  const commonData = {
    to: newcomer.email,
    from: "sebastien@sifnos.io",
  }
  const firstDelivery = {
    subject: "Wynn: your code to activate your account",
    html: `<p>Your code is:</p><h1>${newcomer.digits}</h1><p>To continue the signup process, <a href='${CLIENT_URI}/connect/signup/enterdigits'>write this code on this page</a></p>`,
  }
  const nextDeliveries = {
    subject: "Wynn: here is another code to activate your account",
    html: `<p>Your new code is:</p><h1>${newcomer.digits}</h1><p>To continue the signup process, <a href='${CLIENT_URI}/connect/signup/enterdigits'>write this code on this page</a></p>`,
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

export const sendNewcomersInvitations = async (sender, newcomers, team, mailer) => {
  newcomers.map(async (newcomer) => {
    const data = {
      to: newcomer.email,
      from: sender.email,
      subject: "Wynn: you are invited you to a new team",
      html: `<h3>${sender.email} invited you to the team <strong>${team.name}</strong>.</h3><p><a href='${CLIENT_URI}/connect/token/${newcomer.token}'>Click here to create your account and join this team</a></p>`,
    }
    await mailer(data)
  })
}
