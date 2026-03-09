import { Route, Routes } from "react-router"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import AdminPage from "./pages/AdminPage"


const App = () => {
  return (
    <div className="">
      <Header/>

      <main className="pt-16">
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/admin" element={<AdminPage/>}/>
      </Routes>
      </main>
    </div>
  )
}

export default App