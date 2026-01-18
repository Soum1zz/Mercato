import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { FaMinus, FaPlus } from "react-icons/fa6";
import { GoArrowDown, GoHeart, GoHeartFill } from "react-icons/go";

import '../styles/productDetail.css'
import { getCurrentUser, getToken } from "../auth/authService";
import toast from "react-hot-toast";
export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [edit, setEdit] = useState(false);
    const [Comments, setcomments] = useState([]);
    const [Comment, setcomment] = useState();
    const [count, setCount] = useState(1);
    const [isWishlisted, setWishlisted] = useState(false);
    const navigate = useNavigate();
    const categories = [
        "Electronics", "Fashion", "Home & Living",
        "Beauty & Personal Care", "Books"
    ];
    useEffect(() => {
        const fetchProduct = async () => {
            const response = await fetch(`http://localhost:8080/api/product/${id}`);
            const data = await response.json();
            setProduct(data);

            const comRes = await fetch(`http://localhost:8080/api/product/${id}/comments`);
            const comData = await comRes.json();
            setcomments(comData);
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        const fetchWishlistStatus = async () => {
            if (!product?.id) return;
            if (!getCurrentUser()) {
                setWishlisted(false);
                return;
            }
            try {
                const res = await fetch(
                    `http://localhost:8080/api/me/product/${product.id}/wishlist`,
                    {
                        headers: {
                            Authorization: `Bearer ${getToken()}`,
                        },
                    }
                );
                if (!res.ok) throw new Error();
                const data = await res.json();
                setWishlisted(data.wishlisted);

            } catch (e) {
                console.error(e)
            }
        }
        fetchWishlistStatus();
    }, [product?.id]);

    const wishlistHandler = async () => {
        try {
            const method = isWishlisted ? "DELETE" : "PUT";
            const res = await fetch(`http://localhost:8080/api/me/product/${product.id}/wishlist`,
                {
                    method,
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            )
            if (!res.ok) {
                throw new Error("Failed adding to wishlist")
            }
            toast.success(
                isWishlisted ?
                    "Removed from wishlist" :
                    "Added to wishlist");
        } catch (e) {
            console.error(e);
            toast.error("Check console")
        }


        setWishlisted(!isWishlisted);

    }
    const addToCartHandler = async () => {
        if (!getCurrentUser()) {
            toast.error("You need to login");
            navigate("/auth");
            return;
        }
        const payload = {
            productId: product.id,
            quantity: count
        }
        try {
            const res = await fetch("http://localhost:8080/api/me/cart",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify(payload)
                }
            )
            if (!res.ok) {
                throw new Error("Failed adding to cart")
            }
            toast.success("Added to cart");
            const data = await res.json();
        } catch (e) {
            console.error(e);
        }
    }
    const orderHandler = async () => {
        if (!getCurrentUser()) {
            toast.error("You need to login");
            navigate("/auth");
            return;
        }
        const orderItem = {
            productId: product.id,
            productQuantity: count
        }
        const payload = {
            items: [orderItem]
        }
        try {
            const res = await fetch("http://localhost:8080/api/me/orders",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify(payload)
                }
            )
            if (!res.ok) {
                throw new Error("Failed to order")
            }
            toast.success("Congratulations you have successfully ordered!");
            const data = await res.json();
        } catch (e) {
            console.error(e);
        }

    }
    const imageUrl = `http://localhost:8080/api/product/${id}/image`
    if (!product) return <p>Loading Product</p>

    if (edit) {
        return (
            <div>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();

                        const form = e.currentTarget;
                        const rawFormData = new FormData(form);

                        const ProductData = {
                            name: rawFormData.get("name"),
                            description: rawFormData.get("description"),
                            price: parseFloat(rawFormData.get("price")) || 0,
                            brand: rawFormData.get("brand"),
                            category: rawFormData.get("category"),
                            stock: parseInt(rawFormData.get("stock"), 10) || 0,
                            status: rawFormData.get("status"),
                            date: rawFormData.get("date"),

                        };

                        const dataToSend = new FormData();

                        dataToSend.append(
                            "request",
                            new Blob([JSON.stringify(ProductData)], { type: "application/json" }),
                            "product.json"
                        );

                        const imageFile = form.querySelector('input[type="file"]').files[0];

                        if (imageFile) {
                            dataToSend.append("image", imageFile);
                        }
                        try {
                            const response = await fetch(`http://localhost:8080/api/product/${product.id}`,
                                {
                                    method: "PUT",
                                    body: dataToSend,
                                });

                            if (response.ok) {
                                const result = await response.json();
                                console.log("Success:", result);
                                alert("Product updated!");
                                setEdit(false);
                            } else {
                                const errorText = await response.text();
                                console.error("Server Error Status:", response.status, "Message:", errorText);
                                alert(`Failed with status ${response.status}. Check backend logs.`);
                            }
                        } catch (e) {
                            console.error("Network Error:", e);
                        }

                    }}>
                    <label>Product Name:
                        <input type="text" name="name" defaultValue={product.name} required />

                    </label><br />
                    <label>Product Desc:
                        <input type="text" name="description" defaultValue={product.description} required />
                    </label><br />
                    <label>Product Price:
                        <input type="number" name="price" step="0.01" min="0" defaultValue={product.price} required />
                    </label><br />
                    <label>Product Brand:
                        <input type="text" name="brand" defaultValue={product.brand} required />
                    </label><br />
                    <label>Product Category:
                        <select name="category" defaultValue={product.category}>
                            {
                                categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))
                            }

                        </select>
                    </label><br />
                    <label>Product Stock:
                        <input type="number" step="1" min="0" name="stock" defaultValue={product.stock} />
                    </label><br />
                    <label>Product Status:
                        <input type="text" name="status" defaultValue={product.status} />
                    </label><br />
                    <label>Release Date:
                        <input type="date" name="date" defaultValue={product.date} />
                    </label><br />
                    <label>image:
                        <input type="file" name="image" />
                    </label><br />

                    <button >Submit</button>
                </form>
                <button onClick={async () => {
                    try {
                        const response = await fetch(`http://localhost:8080/api/product/${product.id}`,
                            {
                                method: "DELETE",
                            });

                        if (response.ok) {

                            console.log("Product Deleted");
                            alert("Product Deleted!");
                            navigate("/");
                        } else {

                            alert("Failed to delete.");
                        }
                    } catch (e) {
                        console.error("Network Error:", e);
                    }
                }}>delete Product</button>
            </div>)
    }
    return (<div className="prod-det-div">
        <div className="prod-det-left">
            <img src={imageUrl} />
            <div className="heart"
                onClick={wishlistHandler}
            >
                {
                    !isWishlisted ? <GoHeart /> : <GoHeartFill />
                }
            </div>
        </div>

        <div className="prod-det-right">
            <div style={{ fontSize: "50px" }}>{product.name}</div>
            <div>from {product.brand}</div>

            <div style={{ fontSize: "43px", fontWeight: "900", color: '#6b1d4d' }}>₹ {product.price}</div>
            {/* Rating Logic*/}
            <div>{product.description}</div>

            <div style={{ fontSize: "30px" }}>Quantity</div>
            <div className="counter">
                <div className="count-btn"
                    onClick={() => setCount((prev) => Math.max(1, prev - 1))}
                ><FaMinus /> </div>
                <input name="count" value={count} disabled></input>
                <div className="count-btn"
                    onClick={() => setCount((prev) => Math.min(product.stock, prev + 1))}
                ><FaPlus /> </div>

            </div>
            {
                product.stock === 0 ?
                    (<button disabled>Out of stock</button>) :
                    (<button onClick={addToCartHandler} className="prod-det-btn">Add to cart</button>)
            }
            <button onClick={orderHandler} className="prod-det-btn">Order now</button>
            <div>
                <div>• In Stock</div>
                <div>• Free shipping on orders over ₹ 500</div>
            </div>


            <div><h2>Comments:</h2>

            </div>
        </div>


    </div>)
}