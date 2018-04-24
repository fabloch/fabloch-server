import { isEmpty, isURL } from "validator"

const checkUrls = (errors, object, fields) => {
  fields.map((field) => {
    if (field in object && !(isEmpty(object[field]) || isURL(object[field]))) {
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
