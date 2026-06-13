import { useEffect, useState } from "react"
import veriImg from "../assets/seller-sec.png"
import '../styles/sellerDash.css'
import SellerForm from "../components/SellerForm";
import { getToken, isTokenExpired, logout } from "../auth/authService";
import { useNavigate } from "react-router-dom";
export default function SellerDash() {
    const [user, setUser] = useState(null);
    const [sellDet, setSell] = useState(null);
    const [showForm, setForm] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (!user?.userId) return;
        const fetchUserDet = async () => {
            try {
                const resUser = await fetch(`http://localhost:8080/seller/${user.userId}/details`,
                    {
                        headers: {
                            Authorization: `Bearer ${getToken()}`,
                        },
                    }
                );
                if (resUser.status === 401) {
                    logout();
                    navigate("/auth");
                    return;
                }
                if (!resUser.ok) {
                    throw new Error(`Http error! status: ${resUser.status}`)
                }


                const data = await resUser.json();
                setSell(data);
                console.log(data?.status)

            } catch (e) {
                console.error("Failed to fetch user", e);

            }

        }
        fetchUserDet();
    }, [user?.userId])
    useEffect(() => {
        const fetchUser = async () => {
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
                        "Authorization": `Bearer ${getToken()}`,
                        "Content-Type": "application/json"
                    }
                });
                if (resUser.status === 401) {
                    logout();
                    navigate("/auth");
                    return;
                }
                if (!resUser.ok) {
                    throw new Error(`Http error! status: ${resUser.status}`)
                }


                const data = await resUser.json();
                setUser(data);
            } catch (e) {
                console.error("Failed to fetch user", e);

            }

        }
        fetchUser();
    }, []);
    return (
        <div className="seller-div">
            <div className="seller-header">
                <div>
                    <h1>Hello {user?.name}</h1>
                    <p>Manage your verification and product listings from one place.</p>
                </div>
                <span className={`seller-status ${sellDet?.status === "APPROVED" ? "approved" : "pending"}`}>
                    {sellDet?.status === "APPROVED" ? "Verified seller" : "Verification pending"}
                </span>
            </div>
            <div className={`sell-veri-div ${sellDet?.status === "PENDING"||sellDet === null ? "" : "active"}`}>
                {
                    sellDet?.status === "PENDING"||sellDet === null
                     ? (<div className="veri-stat">
                        <div className="veri-title">Your verification is pending</div>
                        <div>Please provide your business details to get verified and post your products.</div>
                        <div>P.S. we value your privacy.</div>
                        <button className="veri-btn"
                            onClick={() => setForm(true)}
                        >Submit your details</button>
                    </div>) : (
                        <div className="veri-stat">
                            <div className="veri-title">You are verified</div>
                            <div>Congrats, you can now post products on Mercato.</div>
                        </div>

                    )
                }
                <div className="seller-verify-art">
                    <img src={veriImg} alt="Seller verification" />
                </div>
            </div>
            {sellDet?.status === "APPROVED" && <div className="seller-products-panel">
                <div className="add-btn-div">
                    <button className="add-btn"
                        onClick={() => {
                            navigate("/add-product"
                            )
                        }}
                    >Add Product</button>
                </div>

                <div className="product-div">
                    <h2>Your Products:</h2>
                    <p>Your listed products will appear here.</p>
                </div>

            </div>}
            {
                showForm && (
                    <SellerForm onClose={() => setForm(false)} user={user} sellDet={sellDet} />
                )
            }


        </div>
    )
}
