import CartItem from "../components/CartItem";
import "../styles/cart.css";
import { getCurrentUser, getToken } from "../auth/authService";
import signinImg from "../assets/sign-in.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";

import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { createPaymentOrder } from "../api/paymentApi";
import { getCart, checkoutCart } from "../api/cartApi";
export default function Cart() {
  const navigate = useNavigate();
  const token = getToken();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  // useMemo: memoize decoded user to avoid re-decoding JWT on every render
  const currentUser = useMemo(() => getCurrentUser(), [token]);

  // useMemo: compute subtotal from cart items to avoid re-summing on unrelated renders
  const subtotal = useMemo(() => {
    if (!cart?.items) return cart?.totalPrice || 0;
    return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart?.items, cart?.totalPrice]);

  const orderHandler = async () => {
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    setLoading(true);
    try {
      // Create Razorpay order on backend
      const paymentRes = await createPaymentOrder(cart.totalPrice, "INR");
      const razorpayOrderId = paymentRes.data;

      // load Razorpay checkout script
      await new Promise((resolve, reject) => {
        if (window.Razorpay) return resolve();
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
        document.body.appendChild(script);
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, // Fix #3: read from env instead of hardcoding
        amount: cart.totalPrice * 100,
        currency: "INR",
        order_id: razorpayOrderId,
        handler: async function (response) {
          // Single checkout call: verifies Razorpay signature, places the order,
          // and records the Payment row — all in one atomic backend transaction.
          try {
            await checkoutCart({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              amount: cart.totalPrice,
            });

            toast.success("Payment successful and order placed!");
            setCart({ items: [], totalPrice: 0 });
          } catch (err) {
            console.error("Checkout failed:", err);
            if (err.response?.status === 400) {
              toast.error("Payment verification failed. Please contact support.");
            } else {
              toast.error(`Failed to place order (${err.response?.status || 'unknown'}). Check console for details.`);
            }
          }
        },
        modal: {
          ondismiss: function () {
            // Fix #6: clear loading state so the spinner doesn't get stuck
            setLoading(false);
            toast("Payment popup closed");
          },
        },
        prefill: {
          name: currentUser?.name || "",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      console.error(e);
      toast.error("Payment failed");
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
        const res = await getCart();
        setCart(res.data);
      } catch (e) {
        console.error(e);
        setCart(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [token]);
  if (!currentUser) {
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
        Subtotal: ₹ {subtotal}
      </div>
      <button className="order-btn" onClick={orderHandler}>
        Place your order
      </button>
    </div>
  );
}
