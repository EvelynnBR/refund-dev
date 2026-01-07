import { BrowserRouter } from "react-router"

import { useAuth } from "../hooks/useAuth"

import { Loading } from "../components/Loading"

import { AuthRoutes } from "./auth-routes"
import { EmployeeRoutes } from "./Employee-Routes"
import { ManagerRoutes } from "./Manager-Routes"

export function Routes() {
  const { session, isLoading } = useAuth()

  function Route() {
    switch (session?.user.role) {
      case "employee":
        return <EmployeeRoutes />
      case "manager":
        return <ManagerRoutes />
      default:
        return <AuthRoutes />
    }
  }

  if (isLoading) {
    return <Loading />
  }
  return (
    <BrowserRouter>
      <Route />
    </BrowserRouter>
  )
}
