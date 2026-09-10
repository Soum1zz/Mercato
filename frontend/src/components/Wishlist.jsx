import { useEffect, useState } from "react";
import { getToken } from "../auth/authService";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";
import "../styles/products.css";
import { getCustomerWishlist } from "../api/customerApi";
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
          const res = await getCustomerWishlist();
          setWishlist(res.data);
        } catch (e) {
          if (e.response?.status === 400) {
            setWishlist([]);
            return;
          }
          console.error(e);
          setWishlist([]);
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
