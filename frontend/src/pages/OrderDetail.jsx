import '../styles/orderDetail.css'
import { useLocation, useNavigate, useParams } from "react-router-dom"
import OrderItemSub from "../components/OrderItemSub"
import { useEffect, useState } from "react";
import { getCurrentUser } from "../auth/authService";

export default function OrderDetail(){
    const navigate= useNavigate()
    const location= useLocation()
    const {orderId}=useParams();
    const [order, setOrder]=useState(location.state||null)
    // if(getCurrentUser()){
    //     navigate("/auth")
    //     return;
    // }
    useEffect(() => {
    if(!order)
        {const fetchOrder = async () => {
            const response = await fetch(`http://localhost:8080/api/orders/${orderId}`);
            const data = await response.json();
            setOrder(data);

        };

        fetchOrder();}
  }, [order,orderId]);
    return(
        <div className="order-det-div">
            <h2>Order Details</h2>
            <div>
                <div>Order ID: {order.id}</div>
                <div>Order Date: {order.date}</div>
                <div>Status: {order.status}</div>  
            </div>
            <h3>Order items:</h3>
            <div className="order-card">
                    <div className="order-row order-header">
                      <span>Products</span>
                      <span>Quantity</span>
                      <span>Subtotal</span>
                    </div>
            
                    <div>
                      {order.orderItemResponseList.map((order) => (
                        <OrderItemSub key={order.id} order={order} />
                      ))}
                    </div>
                  </div>
                  <div className='total-price'>Total: {order.totalPrice}</div>
        </div>
    )
}