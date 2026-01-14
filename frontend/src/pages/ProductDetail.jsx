import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { FaMinus, FaPlus } from "react-icons/fa6";
import { GoArrowDown, GoHeart, GoHeartFill } from "react-icons/go";

import '../styles/productDetail.css'
export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [edit, setEdit] = useState(false);
    const [Comments, setcomments] = useState([]);
    const [Comment, setcomment] = useState();
    const [count, setCount] = useState(1);
    const [isWishlisted, setWishlisted]= useState(false);
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

    const addToCartHandler = () => {

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
            onClick={()=>{setWishlisted(!isWishlisted)}}
            >
                {
                    !isWishlisted?<GoHeart/>:<GoHeartFill/>
                }
            </div>
        </div>

        <div className="prod-det-right">
            <div style={{fontSize:"50px"}}>{product.name}</div>
            <div>from {product.brand}</div>

            <div style={{fontSize:"43px",fontWeight:"900" ,color:'#6b1d4d'}}>₹ {product.price}</div>
            {/* Rating Logic*/}
            <div>{product.description}</div>

            <div style={{fontSize:"30px"}}>Quantity</div>
            <div className="counter">
                <div className="count-btn" 
                onClick={()=>setCount((prev)=>Math.max(1,prev-1))}
                ><FaMinus/> </div>
                <input name="count" value={count} disabled></input>
                <div className="count-btn"
                onClick={()=>setCount((prev)=>Math.min(product.stock ,prev+1))}
                ><FaPlus/> </div>

            </div>

            <button onClick={addToCartHandler} className="prod-det-btn">Add to cart</button>
            <div>
                <div>• In Stock</div>
                <div>• Free shipping on orders over ₹ 500</div>
            </div>
            

            <div><h2>Comments:</h2>

            </div>
        </div>


    </div>)
}