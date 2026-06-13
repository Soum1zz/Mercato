
import "../styles/Navbar.css"
import { IoMdSearch } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import { getCurrentUser, isAuthenticated, logout } from "../auth/authService";
import { FaUser } from "react-icons/fa";
import { TbShoppingCart } from "react-icons/tb";

export default function Navbar({ scrollToAbout, scrollToContact}){
    const navigate= useNavigate();
    const location= useLocation();
    const [searchBarOpen, setSearchBarOpen]= useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const[searchQuery, setSearchQuery] = useState("");
    const authenticated = isAuthenticated();

    const searchRef= useRef(null);

    const handleSearch= ()=>{
        if(!searchQuery.trim())return;

        navigate("/products",{
            state: {search: searchQuery}
        });
        setSearchBarOpen(false);
        setMobileMenuOpen(false);
    }
    const handleLogOut=()=>{
        logout();
        setMobileMenuOpen(false);
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

    const handleNavigation= (type)=>{
        if(location.pathname !== "/"){
             navigate("/",{
                state: {scrollTo: type}
             });
        } else{
            type === "about"? scrollToAbout():scrollToContact();
        }
        setMobileMenuOpen(false);
    };

    const navigateAndClose = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    const renderNavLinks = () => (
        <>
            <button type="button" onClick={()=>navigateAndClose("/")}>Home</button>
            <button type="button" onClick={()=>navigateAndClose("/products")}>Products</button>
            <button type="button" onClick={()=>handleNavigation("about")}>About Us</button>
            <button type="button" onClick={()=>handleNavigation("contact")}>Contact Us</button>
        </>
    );



    return (
        <div className={`navbar-div ${searchBarOpen ? "search-open" : ""}`}>

            <div
            style={{fontSize:"45px",fontWeight:"bolder", cursor: "pointer"}}
             className="brand-name"
             onClick={()=>navigate("/")}

             >
                Mercato
            </div>
            <div className="nav-search-field">
                {renderNavLinks()}
            </div>
            <div className="nav-buttons">
                <div
                ref={searchRef
                }
                className="nav-search-action"
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
                    onClick={()=>{
                        if(searchBarOpen&& searchQuery.trim()){
                            handleSearch();
                        }else{
                            setSearchBarOpen(true);
                            setMobileMenuOpen(false);
                        }
                        }}
                 />
                </div>
                <div className="logout-wrap">
                {authenticated &&
                (<button className="log-out-btn" onClick={handleLogOut}>Log out</button>)}
                </div>
                <FaUser size={30}
                    onClick={handleAuth}
                    className="nav-icon"
                />
                
                
                <div
                className="cart-icon-wrap"
                onClick={()=>navigate("/cart")}
                ><TbShoppingCart
                 size={35}/></div>
                <button
                    type="button"
                    className="menu-toggle"
                    aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    onClick={() => {
                        setMobileMenuOpen((prev) => !prev);
                        setSearchBarOpen(false);
                    }}
                >
                    {mobileMenuOpen ? <IoClose /> : <IoMenu />}
                </button>
            </div>
            <div className={`mobile-nav ${mobileMenuOpen ? "open" : ""}`}>
                {renderNavLinks()}
                {authenticated &&
                    (<button type="button" onClick={handleLogOut}>Log out</button>)}
            </div>

        </div>
    )
}
