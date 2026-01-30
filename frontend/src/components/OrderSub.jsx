
import { useNavigate } from "react-router-dom"

export default function OrderSub({order}){
    const navigate= useNavigate()
    const viewOrderHandler= ()=>{
        navigate(`/order-detail/${order.id}`, 
            {
            state: order
            }
        )
    }
    return(
        <div className="order-row order-data">
            <span>{order.id}</span>
            <span>{order.date}</span>

            <span className="status">
                {order.status}
            </span>

            <span>₹{order.totalPrice}</span>
            <button className="view-btn"
            onClick={viewOrderHandler}
            >View Order</button>
        </div>
    )
}