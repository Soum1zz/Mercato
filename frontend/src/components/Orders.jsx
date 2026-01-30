import { useEffect, useState } from "react";
import OrderSub from "../components/OrderSub";
import { getToken } from "../auth/authService";
import "../styles/order.css";
import { useNavigate } from "react-router-dom";
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
      // setLoading(true);
      try {
        const res = await fetch("http://localhost:8080/api/me/orders", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user cart");
        }
        const data = await res.json();
        setOrders(data);
      } catch (e) {
        console.error(e);
        setOrders(null);
      } finally {
        //   setLoading(false);
      }
    };
    fetchWish();
  }, []);
  return (
    <div className="orders-wrapper">
      <h2>My Orders</h2>
      <div className="order-card">
        <div className="order-row order-header">
          <span>Order id</span>
          <span>Order date</span>
          <span>Status</span>
          <span>Total</span>
          <span></span>
        </div>

        <div>
          {orders.map((order) => (
            <OrderSub key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}
