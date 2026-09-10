import { useEffect, useRef, useState, useMemo } from "react";
import "../styles/customer.css";
import { FaCamera } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import { IoMdHeart } from "react-icons/io";
import { TbUserFilled } from "react-icons/tb";
import Wishlist from "../components/Wishlist";
import CustomerForm from "../components/CustomerForm";
import Orders from "../components/Orders";
import { getToken, isTokenExpired, logout, fetchUserProfile } from "../auth/authService";
import { useNavigate } from "react-router-dom";
import { updateCustomerImage } from "../api/customerApi";
import { uploadToCloudinary } from "../api/uploadApi";
export default function CustomerDetail() {
  const [content, setContent] = useState("CustomerForm");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isForm, setForm] = useState(false);
  const imgUrl = user
    ? `http://localhost:8080/api/user/${user.userId}/image`
    : null;
  const [preview, setPreview] = useState(null);

  const fileInputRef = useRef(null);
  const handleClick = () => {
    fileInputRef.current.click();
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const secureUrl = await uploadToCloudinary(file);
      if (secureUrl && user?.userId) {
        await updateCustomerImage(user.userId, secureUrl);
      }

      const objUrl = URL.createObjectURL(file);
      setPreview(objUrl);
    } catch (e) {
      console.error("Image upload failed", e);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      setPreview(imgUrl);
      if (!getToken()) {
        navigate("/auth");
        return;
      }
      if (isTokenExpired(getToken())) {
        logout();
        navigate("/auth");
        return;
      }
      try {
        const data = await fetchUserProfile();
        if (data) {
          setUser(data);
          setPreview(`http://localhost:8080/api/user/${data.userId}/image`);
        }
      } catch (e) {
        console.error("Failed to fetch user", e);
      }
    };
    fetchUser();
  }, [navigate]);

  // useMemo: memoize truncated name and initial avatar character
  const displayName = useMemo(() => {
    const userName = user?.name || "";
    return userName.length > 18 ? userName.substring(0, 18) + "..." : userName;
  }, [user?.name]);

  const avatarInitial = useMemo(() => {
    return user?.name?.charAt(0).toUpperCase() || "";
  }, [user?.name]);

  const [imgError, setImgError] = useState(false);

  return (
    <div className="customer-div">
      <div className="customer-nav">
        <div className="customer-img">
          {!imgError ? (
            <div>
              
              <img
                src={preview}
                alt={user?.name}
                onError={() => setImgError(true)}
              />
            
          </div>
          ) : (
            <div className="customer-img-fallback">{avatarInitial}</div>
          )}
          <div className="cam-icon" onClick={handleClick}>
                <FaCamera />
              </div>
          

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            hidden
          />
          <p>{displayName}</p>
        </div>
        <div className="nav-sub">
          <div
            onClick={() => setContent("CustomerForm")}
            className={`nav-sub-cat ${content === "CustomerForm" ? "active" : ""}`}
          >
            <TbUserFilled style={{ fontSize: "30px" }} />
            <p>My Details</p>
          </div>
          <div
            onClick={() => setContent("Wishlist")}
            className={`nav-sub-cat ${content === "Wishlist" ? "active" : ""}`}
          >
            <IoMdHeart style={{ fontSize: "30px" }} />
            <p>My Wishlist</p>
          </div>
          <div
            onClick={() => setContent("Orders")}
            className={`nav-sub-cat ${content === "Orders" ? "active" : ""}`}
          >
            <FaBagShopping style={{ fontSize: "30px" }} />
            <p>My Orders</p>
          </div>
        </div>
      </div>
      <div className="prof-sub-div">
        {content === "CustomerForm" && (
          <CustomerForm user={user} isForm={isForm} setForm={setForm} />
        )}
        {content === "Wishlist" && <Wishlist user={user} />}
        {content === "Orders" && <Orders user={user} />}
      </div>
    </div>
  );
}
