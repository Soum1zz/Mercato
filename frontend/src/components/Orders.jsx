import OrderSub from "../components/OrderSub"
import "../styles/order.css"
export default function Orders(){
    return(<div className="orders-wrapper">
        <h2>My Orders</h2>
           <div className="order-card">
            <div className="order-row order-header">
                <span>Order id</span>
                <span>Order date</span>
                <span>Status</span>
                <span>Total</span>
                <span></span>

            </div>

            <div >
                <OrderSub />
            </div>
           </div>

    </div>)
}

