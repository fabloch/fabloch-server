const checkForbidden = (fields, object, errors) => {
  fields.map((field) => {
    if (object.hasOwnProperty(field)) {
      const stringifiedField = field.replace(/([A-Z])/, " $1").toLowerCase()
      errors.push({
        key: field,
        message: `Forbidden field: ${stringifiedField}.`,
      })
    }
    return true
  })
  return errors
}

export default checkForbidden