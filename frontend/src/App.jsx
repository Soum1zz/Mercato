import { useState, useRef } from 'react'
import {BrowserRouter, Routes, Route, useLocation} from "react-router-dom"
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Authenticate from './pages/Authenticate'
import Cart from './pages/Cart'
import ProductForm from './pages/ProductForm'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import CustomerDetail from './pages/CustomerDetail'
import AdminDash from './pages/AdminDash'
import SellerReviewDash from './pages/SellerReviewDash'
import SellerDash from './pages/SellerDash'
import ProtectedRoute from './auth/ProtectedRoute'
import { Toaster } from 'react-hot-toast'
function App() {
  const [theme, setTheme]=  useState ("light");
  const[products, setProducts]= useState([]);
  const noNavbar= ['/auth'];
  const aboutRef=useRef(null);
  const contactRef=useRef(null);
  return (
    <div className={`wrapper ${theme==="light"? "":" active"}`}>
      
        {!noNavbar.includes(location.pathname) &&<  Navbar 

        scrollToAbout={()=>aboutRef.current?.scrollIntoView({ behavior:"smooth"})}
        scrollToContact={()=>contactRef.current?.scrollIntoView({ behavior:"smooth"})}

       
       theme={theme} setTheme={setTheme} setProducts={setProducts}/>}
      <Toaster position='top-right' />
        <Routes>
          <Route path='/' element={<Home products={products} aboutRef={aboutRef}
          contactRef={contactRef}/>} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/auth' element={<Authenticate />} />
          <Route path='/productForm' element={<ProductForm />} />
          <Route path='/products' element={<Products />} />
          <Route path='/product/:id' element={<ProductDetail />} />
          <Route path='/auth' element={<Authenticate />} />
          <Route path='/seller-review' element={<ProtectedRoute><SellerReviewDash /></ProtectedRoute>} />
          <Route path='/customer' element={<ProtectedRoute><CustomerDetail /></ProtectedRoute> } />
          <Route path='/admin' element={<ProtectedRoute><AdminDash /></ProtectedRoute> } />
          <Route path='/seller' element={<ProtectedRoute><SellerDash /></ProtectedRoute> } />
          <Route path='/add-product' element={<ProtectedRoute><ProductForm/></ProtectedRoute> } />

        </Routes>
       
      
    </div>
  )
}

export default App
