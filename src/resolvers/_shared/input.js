import { isEmail, isLength, isURL } from "validator"
import { isNil } from "ramda"

const firstUpper = field =>
  field
    .replace(/([A-Z])/, " $1")
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase())

export const checkMissing = (validationErrors, field, parent) => {
  if (!parent[field] || isNil(parent[field])) {
    const missingString = `${firstUpper(field)} is missing.`
    if (validationErrors[field]) {
      validationErrors[field].push(missingString)
    }
    validationErrors[field] = [missingString]
  }
  return validationErrors
}

export const checkEmpty = (validationErrors, field, parent) => {
  if (parent[field] === "") {
    const fieldMissing = `${firstUpper(field)} is empty.`
    if (validationErrors[field]) {
      validationErrors[field].push(fieldMissing)
    } else {
      validationErrors[field] = [fieldMissing]
    }
  }
  return validationErrors
}

export const checkLength = (validationErrors, field, lengths, parent) => {
  if (lengths.min) {
    const lengthString = `${firstUpper(field)} should have at least ${lengths.min} characters.`
    if (parent[field] && parent[field].length < lengths.min) {
      if (validationErrors[field]) {
        validationErrors[field].push(lengthString)
      }
      validationErrors[field] = [lengthString]
    }
  }
  if (lengths.max) {
    const lengthString = `${firstUpper(field)} should have less than ${lengths.max} characters.`
    if (parent[field] && parent[field].length >= lengths.max) {
      if (validationErrors[field]) {
        validationErrors[field].push(lengthString)
      }
      validationErrors[field] = [lengthString]
    }
  }
  return validationErrors
}

export const checkEmail = (validationErrors, field, parent) => {
  if (!parent[field] || isEmail(parent[field])) {
    return validationErrors
  }
  if (validationErrors.email) {
    validationErrors.email.push(["Email is invalid."])
  } else {
    validationErrors.email = ["Email is not valid."]
  }
  return validationErrors
}

export const checkUrl = (validationErrors, field, parent) => {
  const invalidURL = `${firstUpper(field)} is an invalid Url.`
  if (parent[field] && !isURL(parent[field])) {
    if (validationErrors[field]) {
      validationErrors[field].push(invalidURL)
    } else {
      validationErrors[field] = [invalidURL]
    }
  }
  return validationErrors
}

export const checkPasswordLength = (validationErrors, field, parent) => {
  if (isLength(parent[field], { min: 6, max: 48 }) === false) {
    const invalidLength = "Password must have length between 6 and 48 chars."
    if (validationErrors[field]) {
      validationErrors[field].push(invalidLength)
    } else {
      validationErrors[field] = [invalidLength]
    }
  }
  return validationErrors
}
