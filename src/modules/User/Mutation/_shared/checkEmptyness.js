const checkEmptyness = (errors, object, keys) => {
  keys.map((key) => {
    if (object[key] === "") {
      errors.push({
        key,
        message: "Can't be empty.",
      })
    }
    return true
  })
  return errors
}

export default checkEmptyness
