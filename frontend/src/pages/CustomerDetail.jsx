import { useEffect, useRef, useState } from "react";
import "../styles/customer.css";
import { FaCamera } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import { IoMdHeart } from "react-icons/io";
import { TbUserFilled } from "react-icons/tb";
import Wishlist from "../components/Wishlist";
import CustomerForm from "../components/CustomerForm";
import Orders from "../components/Orders";
import { getToken, isTokenExpired, logout } from "../auth/authService";
import { useNavigate } from "react-router-dom";
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
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Mercato");
    data.append("cloud_name", "dp5zhfxsl");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dp5zhfxsl/image/upload",
        {
          method: "POST",
          body: data,
        },
      );

      const jsonData = await res.json();
      console.log(jsonData);
      try {
        await fetch(`http://localhost:8080/api/user/${user.userId}/image`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            imgUrl: jsonData.secure_url,
          }),
        });
      } catch (e) {
        console.error(e);
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
      console.log(getToken());
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
        const resUser = await fetch("http://localhost:8080/auth/me", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        });
        if (resUser.status === 401) {
          logout();
          navigate("/auth");
          return;
        }
        if (!resUser.ok) {
          throw new Error(`Http error! status: ${resUser.status}`);
        }

        const data = await resUser.json();
        setUser(data);
        setPreview(`http://localhost:8080/api/user/${data.userId}/image`);
      } catch (e) {
        console.error("Failed to fetch user", e);
      }
    };
    fetchUser();
  }, [navigate]);
  const userName = user?.name || "";
  let Name = "";
  if (userName.length > 18) Name = userName.substring(0, 18) + "...";
  else Name = userName;
  return (
    <div className="customer-div">
      <div className="customer-nav">
        <div className="customer-img">
          <img src={preview} alt={user?.name} />

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
          <p>{user?.name}</p>
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
