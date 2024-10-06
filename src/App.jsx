import Home from "./Pages/Home"
import Items from "./Pages/Menu"
import Cart from "./Pages/Cart"

import { BrowserRouter, Route, Routes } from "react-router-dom"


function App() {

  return (
    <>
        
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/shop/:id" element={<Items/>} />
              <Route path="/cart" element={<Cart/>} />
            </Routes>
            
        </BrowserRouter>


    </>
  )
}

export default App
