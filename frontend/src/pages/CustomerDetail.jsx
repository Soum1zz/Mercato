import { useState } from 'react';
import '../styles/customer.css'
import { FaBagShopping } from "react-icons/fa6";
import { IoMdHeart } from "react-icons/io";
import { TbUserFilled } from "react-icons/tb";
import Wishlist from "../components/Wishlist"
import CustomerForm from "../components/CustomerForm"
import Orders from "../components/Orders"

export default function CustomerDetail(){
    const[content, setContent]= useState("CustomerForm");
return(
    <div className='customer-div'>
          <div className='customer-nav'>
            <div className='customer-img'>
                <img alt='profile img'/>
                <p>Customer Name</p>
            </div>
            <div className='nav-sub'>
                 <div onClick={()=>setContent("CustomerForm")} className={`nav-sub-cat ${content==="CustomerForm"?"active":''}`} >
                    <TbUserFilled style={{fontSize: "30px"}}/>
                    <p>My Details</p>
                 </div>
                 <div onClick={()=>setContent("Wishlist")} className={`nav-sub-cat ${content==="Wishlist"?"active":''}`}>
                    <IoMdHeart style={{fontSize: "30px"}}/>
                    <p>My Wishlist</p>
                 </div>
                 <div onClick={()=>setContent("Orders")} className={`nav-sub-cat ${content==="Orders"?"active":''}`}>
                    <FaBagShopping style={{fontSize: "30px"}}/>
                    <p>My Orders</p>
                 </div>
            </div>
          </div>
          <div className="prof-sub-div">
              {content ==="CustomerForm"&& <CustomerForm />}
              {content ==="Wishlist"&&<Wishlist/>}
              {content ==="Orders"&&<Orders />}
          </div>
    </div>
)
}