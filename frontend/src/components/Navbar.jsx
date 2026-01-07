
import "../styles/Navbar.css"
import { IoMdSearch } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoCart } from "react-icons/io5";
import cart from '../assets/cart-no-notif.png'
import cartNotif from '../assets/cart-yes-notif.png'
import profile from '../assets/black-icon.png'
import { getCurrentUser, isAuthenticated, logout } from "../auth/authService";

export default function Navbar({ scrollToAbout, scrollToContact}){
    const navigate= useNavigate();
    const location= useLocation();
    const [authenticated, setAuthenticated]= useState(isAuthenticated());
    const [searchBarOpen, setSearchBarOpen]= useState(false);
    const searchRef= useRef(null);

    const handleLogOut=()=>{
        logout();
        setAuthenticated(false);
        navigate("/auth", {replace:true});
    }
    const handleAuth= ()=>{
        const user=getCurrentUser();
        const rolePath= user?.role?.toLowerCase();
        if(isAuthenticated()){navigate(`/${rolePath}`)}
        else{navigate("/auth")}
    }
    useEffect(()=>{
        function handleClickOutside(e){
            if(
                 searchRef.current&&
                 !searchRef.current.contains(e.target)
            ){
                setSearchBarOpen(false);
            }
        }
        if(searchBarOpen){
            document.addEventListener("mousedown",handleClickOutside);
        }

        return ()=>{
            document.removeEventListener("mousedown",handleClickOutside);

        };

    },[searchBarOpen]);

    useEffect(()=>{
            setAuthenticated(isAuthenticated());
    },[location.pathname])
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
                ref={searchRef
                }
                >
                {searchBarOpen&&(<div className="search-field"><input type="text" placeholder="search products...."/></div>)}

                 <IoMdSearch
                    onClick={()=>setSearchBarOpen(prev => !prev)}
                 />
                </div>
                <div
                
                >
                {authenticated &&
                (<button onClick={handleLogOut}>Log out</button>)}
                <img src={profile} width="35px"
                    onClick={handleAuth}
                />
                
                </div>
                <div><img src={cart} width="34px"/></div>
            </div>

        </div>
    )
}