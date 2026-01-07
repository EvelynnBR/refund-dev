import { Routes } from "./routes"
import { AuthProvider } from "./contexts/AuthContext"

export function App() {
  console.log(localStorage.getItem("name"))
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  )
}
