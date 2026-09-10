import { useEffect, useState } from "react";
import OrderSub from "../components/OrderSub";
import { getToken } from "../auth/authService";
import "../styles/order.css";
import { useNavigate } from "react-router-dom";
import { getUserOrders } from "../api/orderApi";
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchWish = async () => {
      if (!getToken()) {
        setOrders(null);
        navigate("/auth");
        return;
      }
      try {
        const res = await getUserOrders();
        setOrders(res.data);
      } catch (e) {
        console.error(e);
        setOrders(null);
      }
    };
    fetchWish();
  }, [navigate]);
  return (
    <div className="orders-wrapper">
      <h2>My Orders</h2>
      {Array.isArray(orders) && orders.length === 0 ? (
        <div className="empty-state customer-empty-state">
          No orders yet.
        </div>
      ) : (
        <div className="order-card">
          <div className="order-row order-header">
            <span>Order id</span>
            <span>Order date</span>
            <span>Status</span>
            <span>Total</span>
            <span></span>
          </div>

          <div>
            {Array.isArray(orders) && orders.map((order) => (
              <OrderSub key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
