import electronics from "../assets/electronics.png"
import fashion from "../assets/fash.png"
import food from "../assets/food.png"
import cosme from "../assets/cosme.png"
import truck from "../assets/truck.png"
import returnImg from "../assets/return.png"
import secure from "../assets/secure.png"
import sparkle from "../assets/sparkle.png"



import { useEffect, useState } from "react";
import "../styles/hero.css"

export default function Hero(){
    const images= [electronics, fashion, food, cosme];
    const [curInd, setCurInd]= useState(0);


    return(
        <div className="hero-div">
            <div className="hero-img"
            
            />
            <div className="hero-content">
            <div className="hero-txt">Fashion Redefined</div>
            <div className="hero-sub-txt">Discover quality fashion ,and essentials - curated for everyday life</div>
            <button className="hero-btn">Shop now</button>
            
            </div>
            <div className="hero-footer">
                <div className="hero-sub-footer">
                    <img src={truck} className="hero-footer-img"/>
                    <p>Fast Delivery of Products</p>
                </div>
                <div className="hero-sub-footer">
                    <img src={returnImg} className="hero-footer-img"/>
                    <p>7-Day Easy Returns</p>
                </div>
                <div className="hero-sub-footer">
                    <img src={secure} className="hero-footer-img"/>
                    <p>Secure Payments</p>
                </div>
                <div className="hero-sub-footer">
                    <img src={sparkle} className="hero-footer-img"/>
                    <p>100+ Satisfied Customers</p>

                </div>
            </div>
            
        </div>
    )
}