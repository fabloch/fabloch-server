import { URL } from 'url'
import ValidationError from './validationError'

const assertValidLink = ({ url }) => {
  try {
    // URL(url)
    new URL(url)
  } catch (error) {
    throw new ValidationError('Link validation error: invalid url.', 'url')
  }
}

export default assertValidLink
