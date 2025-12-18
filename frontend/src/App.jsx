import { useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Authenticate from './pages/Authenticate'
import Cart from './pages/Cart'
import ProductForm from './components/ProductForm'
function App() {
  const [theme, setTheme]=  useState ("light");


  return (
    <div className={`wrapper ${theme==="light"? "":" active"}`}>
        <Navbar theme={theme} setTheme={setTheme}/>

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/auth' element={<Authenticate />} />
          <Route path='/productForm' element={<ProductForm />} />

        </Routes>
      
    </div>
  )
}

export default App
