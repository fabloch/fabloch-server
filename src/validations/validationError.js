class ValidationError extends Error {
  constructor(message, field) {
    super(message)
    this.field = field
  }
}

export default ValidationError
