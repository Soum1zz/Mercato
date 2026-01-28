import { useEffect, useState } from "react";
import { getToken } from "../auth/authService";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";
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
  
          if (!res.ok) {
            throw new Error("Failed to fetch user cart");
          }
          const data = await res.json();
          setWishlist(data);
        } catch (e) {
          console.error(e);
          setWishlist(null);
        } finally {
        //   setLoading(false);
        }
      };
      fetchWish()
    },[]);
  return (
    <div>
      <h2>My Wishlist</h2>

      <div className="all-prods">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
