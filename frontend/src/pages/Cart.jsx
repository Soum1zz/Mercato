import CartItem from "../components/CartItem";
import "../styles/cart.css"
import { getCurrentUser, getToken } from "../auth/authService";
import signinImg from "../assets/sign-in.png"
import { useNavigate } from "react-router-dom";
export default function Cart(){
    const navigate= useNavigate();
    const token=getToken();
    return(
        <div >
           {
            token ?(
                <div
                className="cart-div no-cart"
                >
                   <img src={signinImg} width={500}/>
                   <div>
                   You are not logged in.</div>
                   <div>
                   Sign in to your account to access your cart.</div>
                   <button className="auth-btn"
                   onClick={()=>{navigate("/auth")}}
                   >Sign in</button>
                </div>
            ):
            (<div className="cart-div"><h2>Your Cart</h2> 
           <div>
            <CartItem/>
           </div>
           <div
           style={{textAlign: "right", marginRight:"7rem"}}
           >Subtotal:</div>
            <button className="order-btn">Place your order</button>

           </div>
           )
           }
        </div>
    )
}