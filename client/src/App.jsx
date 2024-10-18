import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/about"
import Profile from "./pages/profile"
import SignIn from "./pages/signIn"
import SignUp from "./pages/signUp"
import Header from "./components/Header"
import PrivateRoute from "./components/privateRoute"
import CreateListing from "./pages/CreateListing"


export default function App() {
  return (
  <BrowserRouter>
  <Header/>
  <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/About" element={<About />} /> 
        <Route path="/signIn" element={<SignIn />} /> 
        <Route path="/signUp" element={<SignUp />} /> 
        <Route element={<PrivateRoute/>} > 
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-listing" element={<CreateListing />} />
        </Route>
    </Routes>
    </BrowserRouter>
   
  )
}