const checkMissing = (fields, object, errors) => {
  fields.map((field) => {
    if (object[field] === undefined) {
      const stringifiedField = field.replace(/([A-Z])/, " $1").toLowerCase()
      errors.push({
        key: field,
        message: `Missing ${stringifiedField}.`,
      })
    }
    return true
  })
  return errors
}

export default checkMissing
