const hasRole = (user, role) => {
  if (user.roles && user.roles.indexOf(role) > -1) {
    return true
  }
  return false
}

export default hasRole
