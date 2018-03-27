import { CLIENT_URI, EMAIL_DEFAULT } from "../../utils/config"

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

export const sendInvites = async (newcomers, message, mailer) => {
  newcomers.map(async (newcomer) => {
    const data = {
      to: `${newcomer.fullName} <${newcomer.email}>`,
      from: EMAIL_DEFAULT,
      subject: "Welcome to FAB14 Ecology. Book now the events you want to attend",
      html: `<h3>Welcome, ${newcomer.fullName}</h3><p>${message}</p><p><a href='${CLIENT_URI}/inscription/token/${newcomer.token}'>Click here to finish signup and choose the events you want to attend.</a></p>`,
    }
    await mailer(data)
  })
}
