import { useState } from 'react'
import {BrowserRouter, Routes, Route, useLocation} from "react-router-dom"
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Authenticate from './pages/Authenticate'
import Cart from './pages/Cart'
import ProductForm from './components/ProductForm'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import CustomerDetail from './pages/CustomerDetail'
function App() {
  const [theme, setTheme]=  useState ("light");
  const[products, setProducts]= useState([]);
  const noNavbar= ['/auth'];

  const location= useLocation();
  return (
    <div className={`wrapper ${theme==="light"? "":" active"}`}>
       {!noNavbar.includes(location.pathname) &&<  Navbar theme={theme} setTheme={setTheme} setProducts={setProducts}/>}

        <Routes>
          <Route path='/' element={<Home products={products}/>} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/auth' element={<Authenticate />} />
          <Route path='/productForm' element={<ProductForm />} />
          <Route path='/products' element={<Products />} />
          <Route path='/product/:id' element={<ProductDetail />} />
          <Route path='/auth' element={<Authenticate />} />
          <Route path='/customer' element={<CustomerDetail />} />
        </Routes>
      
    </div>
  )
}

export default App
