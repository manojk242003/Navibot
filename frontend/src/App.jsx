import Home from "./Pages/Home"
import Items from "./Pages/Menu"
import Cart from "./Pages/Cart"

import { BrowserRouter, Route, Routes } from "react-router-dom"
import Profile from "./Pages/Profile"
import Signin from "./Pages/Signin"
import Signup from "./Pages/Signup"

function App() {

  return (
    <>
        
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/profile" element={<Profile/>}/>
              <Route path="/shop/:id" element={<Items/>} />
              <Route path="/cart" element={<Cart/>} />
              <Route path="/signin" element={<Signin/>} />
              <Route path="/signin" element={<Signin/>} />
              <Route path="/signup" element={<Signup/>} />
            </Routes>
        </BrowserRouter>


    </>
  )
}

export default App
