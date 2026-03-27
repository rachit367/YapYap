import { Route, Routes } from "react-router"
import Auth from "./pages/Auth/Auth"
import Chat from "./pages/Chat/Chat"

import { Toaster } from "sonner"
import { GuestRoute, PrivateRoute } from "./pages/PageGuards"
import { SocketContextProvider } from "./context/SocketContext"

const App: React.FC = () => {
  return (
    <>
      <SocketContextProvider>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Chat />}/>
          </Route>
          <Route element={<GuestRoute />}>
            <Route path="/auth" element={<Auth />}/>
          </Route>
        </Routes>
      </SocketContextProvider>
      <Toaster richColors position="top-right"/>
    </>
  )
}

export default App
