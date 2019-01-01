const checkEmptyness = (validationErrors, keys, object) => {
  keys.map(key => {
    if (object[key] === "") {
      const keyMissing = `${key} is Missing.`
      if (validationErrors[key]) {
        validationErrors[key].push(keyMissing)
      } else {
        validationErrors[key] = [keyMissing]
      }
    }
  })
  return validationErrors
}

export default checkEmptyness
