import { hasRole } from "../../_shared/auth"

const isAdmin = user => hasRole("admin", user)

export default isAdmin
