
import "../styles/Navbar.css"
import { IoMdSearch } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoCart } from "react-icons/io5";
import cart from '../assets/cart-no-notif.png'
import { getCurrentUser, isAuthenticated, logout } from "../auth/authService";
import { FaUser } from "react-icons/fa";
import { TbShoppingCart, TbShoppingCartExclamation } from "react-icons/tb";

export default function Navbar({ scrollToAbout, scrollToContact}){
    const navigate= useNavigate();
    const location= useLocation();
    const [authenticated, setAuthenticated]= useState(isAuthenticated());
    const [searchBarOpen, setSearchBarOpen]= useState(false);
    const[searchQuery, setSearchQuery] = useState("");

    const searchRef= useRef(null);

    const handleSearch= ()=>{
        if(!searchQuery.trim())return;

        navigate("/products",{
            state: {search: searchQuery}
        });
        setSearchBarOpen(false);
    }
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
                {searchBarOpen&&(
                    <div className="search-field">
                    <input type="text" 
                        placeholder="search products...."
                        value={searchQuery}
                        onChange={(e)=>setSearchQuery(e.target.value)}
                        onKeyDown={(e)=>e.key === "Enter" &&handleSearch()}
                    />
                    </div>)}

                 <IoMdSearch size={40}
                 style={{marginTop:"10px", cursor:"pointer"}}
                    onClick={()=>{
                        if(searchBarOpen&& searchQuery.trim()){
                            handleSearch();
                        }else{
                            setSearchBarOpen(true);
                        }
                        }}
                 />
                </div>
                <div
                style={{
                    display:"flex",alignItems:"baseline"
                }}
                >
                {authenticated &&
                (<button className="log-out-btn" onClick={handleLogOut}>Log out</button>)}
                </div>
                <FaUser size={30}
                    onClick={handleAuth}
                />
                
                
                <div
                onClick={()=>navigate("/cart")}
                ><TbShoppingCart
                style={{position: "absolute", top: "3rem"}}
                 size={35}/></div>
            </div>

        </div>
    )
}