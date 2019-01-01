const createDigits = () => {
  const digits = []
  for (let i = 0; i < 6; i += 1) {
    digits[i] = Math.floor((Math.random() * 9999) / 1000)
  }
  return digits
}

export default createDigits
