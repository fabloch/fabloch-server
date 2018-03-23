import { isEqual } from "lodash"
import getNewcomerFromToken from "../_shared/getNewcomerFromToken"
import ValidationError from "../../_shared/ValidationError"

const checkDigits = async (data, { mongo: { Newcomers } }) => {
  const newcomer = await getNewcomerFromToken(data.newcomer.token, Newcomers)
  if (!newcomer) {
    throw new ValidationError([{
      key: "main",
      message: "Newcomer doesn't exist.",
    }])
  }
  if (!isEqual(newcomer.digits, data.newcomer.digits)) {
    throw new ValidationError([{
      key: "main",
      message: "Digits don't match.",
    }])
  }
  return newcomer
}

export default checkDigits
