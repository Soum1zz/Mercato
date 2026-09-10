import { useCallback, useEffect, useState, useMemo } from "react"
import veriImg from "../assets/seller-sec.png"
import '../styles/sellerDash.css'
import SellerForm from "../components/SellerForm";
import { getToken, isTokenExpired, logout, fetchUserProfile, fetchSellerDetails } from "../auth/authService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getSellerProducts, updateSellerProduct } from "../api/sellerApi";
import { uploadToCloudinary } from "../api/uploadApi";
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
            const res = await getSellerProducts(sellerId);
            setSellerProducts(res.data);
        } catch (e) {
            if (e.response?.status === 401) {
                logout();
                navigate("/auth");
                return;
            }
            console.error("Failed to fetch seller products", e);
            toast.error("Could not load your products");
        } finally {
            setProductsLoading(false);
        }
    }, [navigate]);

    const updateProductHandler = async (e) => {
        e.preventDefault();
        if (!editingProduct) return;

        setUpdatingProduct(true);
        const form = e.currentTarget;
        const rawFormData = new FormData(form);

        try {
            const imageUrl = await uploadToCloudinary(rawFormData.get("image"));
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

            const response = await updateSellerProduct(editingProduct.id, productData);
            const updatedProduct = response.data;
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
                const data = await fetchSellerDetails(user.userId);
                if (data) {
                    setSell(data);
                }
            } catch (e) {
                console.error("Failed to fetch seller details", e);
            }
        };
        fetchUserDet();
    }, [navigate, user?.userId]);

    useEffect(() => {
        if (user?.userId && sellDet?.status === "APPROVED") {
            fetchSellerProducts(user.userId);
        }
    }, [fetchSellerProducts, sellDet?.status, user?.userId]);

    useEffect(() => {
        const fetchUser = async () => {
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
                }
            } catch (e) {
                console.error("Failed to fetch user", e);
            }
        };
        fetchUser();
    }, [navigate]);

    // useMemo: memoize seller profile identity, verification status, and UI badges
    const sellerProfile = useMemo(() => {
        if (!user) return null;
        const isApproved = sellDet?.status === "APPROVED";
        const isPending = !sellDet || sellDet?.status === "PENDING";
        const isRejected = sellDet?.status === "REJECTED";

        return {
            userId: user.userId,
            name: user.name || "Seller",
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
            address: user.address || "",
            status: sellDet?.status || "PENDING",
            isApproved,
            isPending,
            isRejected,
            badgeText: isApproved ? "Verified seller" : isRejected ? "Verification rejected" : "Verification pending",
            badgeClass: isApproved ? "approved" : "pending",
            taxId: sellDet?.taxId || "",
            description: sellDet?.description || "",
        };
    }, [user, sellDet]);

    // useMemo: memoize costly calculation of seller product inventory stats
    const sellerStats = useMemo(() => {
        if (!sellerProducts || sellerProducts.length === 0) {
            return { totalProducts: 0, inStockCount: 0, outOfStockCount: 0, totalStockUnits: 0 };
        }
        return sellerProducts.reduce(
            (acc, prod) => {
                const stock = Number(prod.stock) || 0;
                acc.totalProducts += 1;
                acc.totalStockUnits += stock;
                if (stock > 0 && prod.status === "AVAILABLE") {
                    acc.inStockCount += 1;
                } else {
                    acc.outOfStockCount += 1;
                }
                return acc;
            },
            { totalProducts: 0, inStockCount: 0, outOfStockCount: 0, totalStockUnits: 0 }
        );
    }, [sellerProducts]);

    // useMemo: memoize sorted seller products to avoid re-sorting on every render
    const sortedProducts = useMemo(() => {
        if (!sellerProducts || sellerProducts.length === 0) return [];
        return [...sellerProducts].sort((a, b) => (b.id || 0) - (a.id || 0));
    }, [sellerProducts]);

    return (
        <div className="seller-div">
            <div className="seller-header">
                <div>
                    <h1>Hello {sellerProfile?.name || user?.name}</h1>
                    <p>Manage your verification and product listings from one place.</p>
                </div>
                <span className={`seller-status ${sellerProfile?.badgeClass || "pending"}`}>
                    {sellerProfile?.badgeText || "Verification pending"}
                </span>
            </div>
            <div className={`sell-veri-div ${sellerProfile?.isPending ? "" : "active"}`}>
                {
                    sellerProfile?.isPending
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
            {sellerProfile?.isApproved && <div className="seller-products-panel">
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
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem", color: "#666", fontSize: "14px" }}>
                        <span>Total: <strong>{sellerStats.totalProducts}</strong></span>
                        <span>•</span>
                        <span>In Stock: <strong style={{ color: "#2e7d32" }}>{sellerStats.inStockCount}</strong></span>
                        <span>•</span>
                        <span>Out of Stock: <strong style={{ color: "#d32f2f" }}>{sellerStats.outOfStockCount}</strong></span>
                        <span>•</span>
                        <span>Total Units: <strong>{sellerStats.totalStockUnits}</strong></span>
                    </div>
                    {productsLoading ? (
                        <p>Loading your products...</p>
                    ) : sellerProducts.length === 0 ? (
                        <div className="empty-state seller-empty-state">
                            No products available.
                        </div>
                    ) : (
                        <div className="seller-products-grid">
                            {sortedProducts.map((product) => (
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
