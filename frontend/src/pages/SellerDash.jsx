import { useState } from "react"
import veriImg from "../assets/seller-sec.png"
import '../styles/sellerDash.css'
import SellerForm from "../components/SellerForm";
export default function SellerDash(){
    const [showForm, setForm]=useState(false);
    return(
        <div className="seller-div">
            <h1>Hello mr. seller</h1>
            <h2>Mercato values your products.</h2>
            <div className="sell-veri-div">
                <div className="veri-stat">
                    <div style={{fontSize: "30px"}}>Your verification is pending</div>
                    <div>Please provide your business details to get verified and post your products.</div>
                    <div>P.S. we value your privacy.</div>
                    <button className="veri-btn"
                    onClick={()=>setForm(true)}
                    >Submit your details</button>
                </div>
                <div>
                    <img src={veriImg} width={500}/>
                </div>
             </div>
             {
                showForm &&(
                    <SellerForm onClose={()=>setForm(false)} />
                )
             }
            {/*(
                <div>
                    <button>Add Product</button>
                    <button>Update Product</button>
                    
                </div>
            )
             */}

        </div>
    )
}