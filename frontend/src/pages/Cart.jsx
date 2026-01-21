import CartItem from "../components/CartItem";
import "../styles/cart.css";
import { getCurrentUser, getToken } from "../auth/authService";
import signinImg from "../assets/sign-in.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Loader from "../components/Loader";
import toast from "react-hot-toast";
export default function Cart() {
  const navigate = useNavigate();
  const token = getToken();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const orderHandler = async () => {
    if (!getCurrentUser()) {
      navigate("/auth");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/me/cart/order", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) {
        toast.error("Failed to order");
        throw new Error("Failed to order");
      }
      toast.success("Congratulations you have successfully placed your order");

      setCart({
        items: [],
        totalPrice: 0,
      });
    } catch (e) {
      console.error(e);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        setCart(null);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8080/api/me/cart", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user cart");
        }
        const data = await res.json();
        setCart(data);
      } catch (e) {
        console.error(e);
        setCart(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [token]);
  if (!getCurrentUser()) {
    return (
      <div className="cart-div no-cart">
        <img src={signinImg} width={500} />
        <div>You are not logged in.</div>
        <div>Sign in to your account to access your cart.</div>
        <button
          className="auth-btn"
          onClick={() => {
            navigate("/auth");
          }}
        >
          Sign in
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-div">
        <h2>Your Cart</h2>
        <div style={{ textAlign: "center" }}>Your cart is empty</div>
      </div>
    );
  }
  return (
    <div className="cart-div">
      <h2>Your Cart</h2>
      {cart?.items.map((item) => (
        <CartItem key={item.productId} cartItem={item} setCart={setCart} />
      ))}
      <div style={{ textAlign: "right", marginRight: "7rem" }}>
        Subtotal: ₹ {cart.totalPrice}
      </div>
      <button className="order-btn" onClick={orderHandler}>
        Place your order
      </button>
    </div>
  );
}
