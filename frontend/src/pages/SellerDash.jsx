import { useCallback, useEffect, useState } from "react"
import veriImg from "../assets/seller-sec.png"
import '../styles/sellerDash.css'
import SellerForm from "../components/SellerForm";
import { getToken, isTokenExpired, logout } from "../auth/authService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
export default function SellerDash() {
    const [user, setUser] = useState(null);
    const [sellDet, setSell] = useState(null);
    const [showForm, setForm] = useState(false);
    const [sellerProducts, setSellerProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [updatingProduct, setUpdatingProduct] = useState(false);
    const navigate = useNavigate();
    const categories = [
        "Electronics",
        "Fashion",
        "Home & Living",
        "Beauty & Personal Care",
        "Books",
    ];

    const fetchSellerProducts = useCallback(async (sellerId) => {
        setProductsLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/seller/${sellerId}/products`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            if (res.status === 401) {
                logout();
                navigate("/auth");
                return;
            }
            if (!res.ok) {
                throw new Error(`Http error! status: ${res.status}`);
            }
            const data = await res.json();
            setSellerProducts(data);
        } catch (e) {
            console.error("Failed to fetch seller products", e);
            toast.error("Could not load your products");
        } finally {
            setProductsLoading(false);
        }
    }, [navigate]);

    const uploadProductImage = async (file) => {
        if (!file || file.size === 0) return null;
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "Mercato");
        data.append("cloud_name", "dp5zhfxsl");

        const res = await fetch("https://api.cloudinary.com/v1_1/dp5zhfxsl/image/upload", {
            method: "POST",
            body: data,
        });
        if (!res.ok) {
            throw new Error("Image upload failed");
        }
        const jsonData = await res.json();
        return jsonData.secure_url;
    };

    const updateProductHandler = async (e) => {
        e.preventDefault();
        if (!editingProduct) return;

        setUpdatingProduct(true);
        const form = e.currentTarget;
        const rawFormData = new FormData(form);

        try {
            const imageUrl = await uploadProductImage(rawFormData.get("image"));
            const productData = {
                name: rawFormData.get("name"),
                description: rawFormData.get("description"),
                price: parseFloat(rawFormData.get("price")) || 0,
                brand: rawFormData.get("brand"),
                category: rawFormData.get("category"),
                stock: parseInt(rawFormData.get("stock"), 10) || 0,
                date: rawFormData.get("date") || null,
                imgUrl: imageUrl,
            };

            const response = await fetch(`http://localhost:8080/seller/product/${editingProduct.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Product update failed");
            }

            const updatedProduct = await response.json();
            setSellerProducts((prev) =>
                prev.map((product) => product.id === updatedProduct.id ? updatedProduct : product)
            );
            toast.success("Product updated");
            setEditingProduct(null);
        } catch (e) {
            console.error("Product update failed", e);
            toast.error("Product not updated");
        } finally {
            setUpdatingProduct(false);
        }
    };

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
    }, [navigate, user?.userId])
    useEffect(() => {
        if (user?.userId && sellDet?.status === "APPROVED") {
            fetchSellerProducts(user.userId);
        }
    }, [fetchSellerProducts, sellDet?.status, user?.userId]);
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
    }, [navigate]);
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
                    <h2>Your Products</h2>
                    {productsLoading ? (
                        <p>Loading your products...</p>
                    ) : sellerProducts.length === 0 ? (
                        <p>Your listed products will appear here.</p>
                    ) : (
                        <div className="seller-products-grid">
                            {sellerProducts.map((product) => (
                                <div className="seller-product-card" key={product.id}>
                                    <img
                                        src={`http://localhost:8080/api/product/${product.id}/image`}
                                        alt={product.name}
                                    />
                                    <div className="seller-product-info">
                                        <h3>{product.name}</h3>
                                        <p>{product.brand}</p>
                                        <div className="seller-product-meta">
                                            <span>Rs. {product.price}</span>
                                            <span>{product.stock} in stock</span>
                                        </div>
                                        <span className={`product-status ${product.status === "AVAILABLE" ? "available" : "out"}`}>
                                            {product.status}
                                        </span>
                                    </div>
                                    <div className="seller-product-actions">
                                        <button type="button" onClick={() => navigate(`/product/${product.id}`)}>
                                            View
                                        </button>
                                        <button type="button" onClick={() => setEditingProduct(product)}>
                                            Update
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>}
            {
                showForm && (
                    <SellerForm onClose={() => setForm(false)} user={user} sellDet={sellDet} />
                )
            }
            {editingProduct && (
                <div className="modal-backdrop">
                    <div className="modal-card">
                        <div className="modal-title">Update product</div>
                        <form onSubmit={updateProductHandler}>
                            <label htmlFor="edit-product-name">Product name</label>
                            <input id="edit-product-name" type="text" name="name" defaultValue={editingProduct.name} required />

                            <label htmlFor="edit-product-description">Description</label>
                            <input id="edit-product-description" type="text" name="description" defaultValue={editingProduct.description} required />

                            <label htmlFor="edit-product-price">Price</label>
                            <input id="edit-product-price" type="number" name="price" step="0.01" min="0" defaultValue={editingProduct.price} required />

                            <label htmlFor="edit-product-brand">Brand</label>
                            <input id="edit-product-brand" type="text" name="brand" defaultValue={editingProduct.brand} required />

                            <label htmlFor="edit-product-category">Category</label>
                            <select id="edit-product-category" name="category" defaultValue={editingProduct.category}>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>

                            <label htmlFor="edit-product-stock">Stock</label>
                            <input id="edit-product-stock" type="number" step="1" min="0" name="stock" defaultValue={editingProduct.stock} />

                            <label htmlFor="edit-product-date">Release date</label>
                            <input id="edit-product-date" type="date" name="date" />

                            <label htmlFor="edit-product-image">Replace image</label>
                            <input id="edit-product-image" name="image" type="file" className="file-input" />

                            <div className="modal-actions">
                                <button className="modal-btn" type="button" onClick={() => setEditingProduct(null)}>
                                    Cancel
                                </button>
                                <button className="modal-btn" type="submit" disabled={updatingProduct}>
                                    {updatingProduct ? "Updating..." : "Update product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


        </div>
    )
}
