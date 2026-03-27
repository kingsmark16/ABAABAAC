import { Route, Routes } from "react-router"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import AdminPage from "./pages/AdminPage"
import { ProtectedRoute } from "./components/protectedRoute/ProtectedRoutes"


const App = () => {
  return (
    <div className="">
      <Header/>

      <main className="pt-16">
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/admin" element={<ProtectedRoute><AdminPage/></ProtectedRoute>}/>
      </Routes>
      </main>
    </div>
  )
}

export default App