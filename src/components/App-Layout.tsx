import { Outlet } from "react-router"
import { Header } from "./Header"

export function AppLayout() {
  return (
    <div className="w-screen h-screen bg-gray-400 flex flex-col items-center text-gray-100">
      <main className="p-3 w-full md:auto lg:min-w-128.5 lg:max-w-200">
        <Header />

        <Outlet />
      </main>
    </div>
  )
}
