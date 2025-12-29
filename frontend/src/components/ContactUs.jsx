import { TiSocialFacebook, TiSocialTwitter, TiSocialInstagram } from "react-icons/ti";
import { FaRegCopyright } from "react-icons/fa";

import '../styles/contact.css'
export default function Contact(){
    return(
    <div className="footer-div">
        <div className="footer-cont">
        <div>
             <h2 style={{fontSize:"50px"}}>Mercato</h2>
             <p>Effortless shopping for modern lifestyles</p>
        </div>
        <div className="separator"></div>
        <div>
            <h3 style={{fontSize:"20px"}}>Shop</h3>
            <p>Products</p>
            <p>Categories</p>
        </div>
        <div className="separator"></div>

        <div>
            <h3 style={{fontSize:"20px"}}>Support</h3>
            <p>Call Us: +91-0000000000</p>
            <p>Email us: mercato@gmail.com</p>
        </div>
        <div className="separator"></div>

        <div>
            <h3 style={{fontSize:"20px", padding:"1rem"}}>Follow Us</h3>
            <div className="footer-social">
                <TiSocialFacebook />
                <TiSocialTwitter />
                <TiSocialInstagram />
            </div>
        </div>
    </div>
            <div className="copy-div">
                            <FaRegCopyright/> <p > 2025 Mercato. All rights reserved.</p>
            </div>
    </div>
    )
}