import { useEffect, useState } from "react";
import { getToken } from "../auth/authService";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";
import "../styles/products.css";
export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate= useNavigate();
  //fetch wishlist
  useEffect(() => {
      const fetchWish = async () => {
        if (!getToken()) {
          setWishlist(null);
          navigate("/auth");
          return;
          
        }
        // setLoading(true);
        try {
          const res = await fetch("http://localhost:8080/api/me/wishlist", {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          });
  
          if (res.status === 400) {
            setWishlist([]);
            return;
          }

          if (!res.ok) {
            throw new Error("Failed to fetch user wishlist");
          }
          const data = await res.json();
          setWishlist(data);
        } catch (e) {
          console.error(e);
          setWishlist([]);
        } finally {
        //   setLoading(false);
        }
      };
      fetchWish()
    },[navigate]);
  return (
    <div>
      <h2>My Wishlist</h2>

      {Array.isArray(wishlist) && wishlist.length === 0 ? (
        <div className="empty-state customer-empty-state">
          No wishlist products yet.
        </div>
      ) : (
        <div className="all-prods">
          {Array.isArray(wishlist) && wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
