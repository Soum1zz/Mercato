import "../styles/Navbar.css"
import { IoMdSearch } from "react-icons/io";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoCart } from "react-icons/io5";
import cart from '../assets/cart-no-notif.png'
import cartNotif from '../assets/cart-yes-notif.png'
import profile from '../assets/black-icon.png'

export default function Navbar({theme, setTheme, setProducts}){
    const navigate= useNavigate();
    const[clicked, setClicked]= useState(false)
    const categories=[
        "All Products",
        "Electronics", "Fashion", "Home & Living", 
        "Beauty & Personal Care", "Books"
    ];
    // const categoryHandler=async(category="All Products")=>{
    //                 let url= "http://localhost:8080/api/products";
                    
    //                 if(category!=="All Products"){
    //                     url=`http://localhost:8080/api/products/${category}`;
    //                 }
 

    //                 try{
    //                 const fetchProduct= await fetch(url);
    //                 if(fetchProduct.ok){
    //                 const data= await fetchProduct.json();
    //                 setProducts(data);}
    //                 }catch(e){
    //                     console.error("Failed to fetch the products:", e);
    //                 }
                    
    //           }
    // useEffect(()=>{
    //     categoryHandler();
    // },[]);
    return (
        <div className="navbar-div">

            <div
            style={{fontSize:"45px",fontWeight:"bolder"}}
             className="brand-name">
                Mercato
            </div>
            <div className="nav-search-field">
                <div>Home</div>
                <select 
                style={{width:"160px", fontSize:"20px"}}
                 defaultValue="All Products" 
                onChange={(e)=>categoryHandler(e.target.value)}
                >
                {
                    categories.map((cat)=>(
                        <option key={cat} value={cat}>{cat}</option>
                    ))
                }
              </select>
                <div>About Us</div>
                <div>Contact Us</div>
            </div>
            <div
            style={{fontSize:"35px"}}
             className="nav-buttons">
                <div
                onClick={()=>setClicked(true)
                
                }>
                {clicked&&(<div className="search-field"><input type="text" placeholder="search products...."/></div>)}
                 <IoMdSearch/></div>
                <div
                onClick={()=>navigate("/auth")
                }
                ><img src={profile} width="35px"/></div>
                <div><img src={cart} width="34px"/></div>
            </div>

        </div>
    )
}