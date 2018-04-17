import { isURL } from "validator"

const checkUrls = (errors, object, fields) => {
  fields.map((field) => {
    if (field in object && !isURL(object[field])) {
      return errors.push({
        key: field,
        message: "Invalid url.",
      })
    }
    return true
  })
  return errors
}

export default checkUrls
