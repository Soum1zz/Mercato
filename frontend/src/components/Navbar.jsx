


import "../styles/Navbar.css"
import { IoMdSearch } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoCart } from "react-icons/io5";
import cart from '../assets/cart-no-notif.png'
import cartNotif from '../assets/cart-yes-notif.png'
import profile from '../assets/black-icon.png'

export default function Navbar({ setProducts, scrollToAbout, scrollToContact}){
    const navigate= useNavigate();
    const[clicked, setClicked]= useState(false)

    const location= useLocation();
    const handleNavigation= (type)=>{
        if(location.pathname !== "/"){
             navigate("/",{
                state: {scrollTo: type}
             });
        } else{
            type === "about"? scrollToAbout():scrollToContact();
        }
    };



    return (
        <div className="navbar-div">

            <div
            style={{fontSize:"45px",fontWeight:"bolder", cursor: "pointer"}}
             className="brand-name"
             onClick={()=>navigate("/")}

             >
                Mercato
            </div>
            <div className="nav-search-field">
                <div
             onClick={()=>navigate("/")}
             style={{cursor:"pointer"}}
                >Home</div>
                <div
             onClick={()=>navigate("/products")}
             style={{cursor:"pointer"}}
                >Products</div>
                <div
                onClick={()=>handleNavigation("about")}
                             style={{cursor:"pointer"}}>About Us</div>
                <div
                onClick={()=>handleNavigation("contact")}
                             style={{cursor:"pointer"}}>Contact Us</div>
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