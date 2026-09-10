import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { FaMinus, FaPlus } from "react-icons/fa6";
import { GoArrowDown, GoHeart, GoHeartFill } from "react-icons/go";
import { IoStar,IoStarHalf,IoStarOutline } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import Loader from "../components/Loader";
import '../styles/productDetail.css'
import { getCurrentUser } from "../auth/authService";
import toast from "react-hot-toast";
import CommentBody from "../components/CommentBody";
import {
  getProductById,
  getProductRating,
  getProductComments,
  addProductComment,
  getUserCommentOnProduct,
  checkWishlistStatus,
  toggleWishlist,
} from "../api/productApi";
import { updateCart } from "../api/cartApi";
import { createOrder } from "../api/orderApi";
import { uploadToCloudinary } from "../api/uploadApi";
import { updateSellerProduct, deleteSellerProduct } from "../api/sellerApi";

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [edit, setEdit] = useState(false);
    const [Comments, setcomments] = useState([]);
    const [yourReview, setYourReview] = useState("");
    const [showReviewBox, setShowReviewBox] = useState(false);
    const [rating, setRating] = useState(null);
    const [yourRating, setYourRating] = useState(0);
    const [yourCommentData, setYourCommentData] = useState(null);
    const [count, setCount] = useState(1);
    const [isWishlisted, setWishlisted] = useState(false);
    const [imgPreview, setImgPreview] = useState(null)
    const navigate = useNavigate();

    const categories = [
        "Electronics", "Fashion", "Home & Living",
        "Beauty & Personal Care", "Books"
    ];
    useEffect(()=>{
        const fetchOwnComment= async ()=>{
            if(!getCurrentUser())return;
            try {
                const res = await getUserCommentOnProduct(id);
                const comData = res.data;
                setYourCommentData(comData);
                setYourReview(comData.desc);
                setYourRating(comData.rating);
                setImgPreview(comData.imgUrl);
            } catch (err) {
                if (err.response?.status === 404) return; // user never reviewed
                console.error(err.response?.status);
                toast.error("Cant fetch your comment");
            }
        }
        fetchOwnComment();
    },[id])
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductById(id);
                setProduct(response.data);

                const ratRes = await getProductRating(id);
                setRating(ratRes.data);

                const comRes = await getProductComments(id);
                setcomments(comRes.data);
            } catch (e) {
                console.error("Failed to load product details", e);
            }
        };

        fetchProduct();
    }, [id]);
    let fullStars=0;
    let hasHalfStar=false;
    let emptyStars=5;
    if(rating && rating.rating != null)
    { 
    fullStars = Math.floor(rating.rating);
    hasHalfStar = rating.rating % 1 >=0.1
    emptyStars = 5 - fullStars - (hasHalfStar? 1 : 0)}

    useEffect(() => {
        const fetchWishlistStatus = async () => {
            if (!product?.id) return;
            if (!getCurrentUser()) {
                setWishlisted(false);
                return;
            }
            try {
                const res = await checkWishlistStatus(product.id);
                setWishlisted(res.data.wishlisted);
            } catch (e) {
                console.error(e)
            }
        }
        fetchWishlistStatus();
    }, [product?.id]);


    const imgUploadHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const secureUrl = await uploadToCloudinary(file);
            setImgPreview(secureUrl);
        } catch (e) {
            console.error("Image upload failed", e);
        }
    };
    
    const submitHandler = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const rawFormData = new FormData(form);
        if (!getCurrentUser()) {
            navigate("/auth");
            return;
        }
        const CommentData = {
            desc: rawFormData.get("desc"),
            rating: yourRating,
            imgUrl: imgPreview,
        };
        try {
            const response = await addProductComment(product.id, CommentData);
            console.log("Success:", response.data);
            toast.success("Comment added!");
            setShowReviewBox(false);
            setYourRating(0);
            setYourReview("");
            const ratRes = await getProductRating(product.id);
            setRating(ratRes.data);

            const comRes = await getProductComments(product.id);
            setcomments(comRes.data);
        } catch (e) {
            console.error("Network Error:", e);
            toast.error("Comment not added!");
        }
    };

    const wishlistHandler = async () => {
        try {
            await toggleWishlist(product.id, isWishlisted);
            toast.success(
                isWishlisted ?
                    "Removed from wishlist" :
                    "Added to wishlist");
            setWishlisted(!isWishlisted);
        } catch (e) {
            console.error(e);
            toast.error("Check console");
        }
    };

    const addToCartHandler = async () => {
        if (!getCurrentUser()) {
            toast.error("You need to login");
            navigate("/auth");
            return;
        }
        const payload = {
            productId: product.id,
            quantity: count
        };
        try {
            await updateCart(payload);
            toast.success("Added to cart");
        } catch (e) {
            console.error(e);
            toast.error("Failed adding to cart");
        }
    };

    const orderHandler = async () => {
        if (!getCurrentUser()) {
            toast.error("You need to login");
            navigate("/auth");
            return;
        }
        const orderItem = {
            productId: product.id,
            productQuantity: count
        };
        const payload = {
            items: [orderItem]
        };
        try {
            await createOrder(payload);
            toast.success("Congratulations you have successfully ordered!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to order");
        }
    };
    const imageUrl = `http://localhost:8080/api/product/${id}/image`
    if (!product) return <Loader/>

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
                            const response = await updateSellerProduct(product.id, ProductData);
                            console.log("Success:", response.data);
                            alert("Product updated!");
                            setEdit(false);
                        } catch (e) {
                            console.error("Network Error:", e);
                            alert("Failed to update product.");
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
                    </label>
                    <br />
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
                        await deleteSellerProduct(product.id);
                        console.log("Product Deleted");
                        alert("Product Deleted!");
                        navigate("/");
                    } catch (e) {
                        console.error("Network Error:", e);
                        alert("Failed to delete.");
                    }
                }}>delete Product</button>
            </div>)
    }
    return (<div className="prod-det-div">
        <div className="prod-det-left">
            <img src={imageUrl} className="prod-img" />
            <div className="heart"
                onClick={wishlistHandler}
            >
                {
                    !isWishlisted ? <GoHeart /> : <GoHeartFill />
                }
            </div>


            <div>
                <h2>Your Review:</h2>
                {
                   !showReviewBox&&yourCommentData&&
                    <CommentBody comment={yourCommentData}/>
                }
                <button className="comment-btn"
                onClick={()=>{
                    if(!getCurrentUser()) {navigate("/auth"); return;}
                    setShowReviewBox(true)}}
                >{
                    yourCommentData==null?
                    ("Write a review"):("Edit your review")}</button>

                {
                    showReviewBox&&(
                        <form className="review-modal"
                        onSubmit={submitHandler}>
                            <h3>Your review:</h3>

                            <div className="star-select">
                                {
                                    [1,2,3,4,5].map(n=>(
                                        <IoStar
                                        key={n}
                                        className={n<=yourRating?"active-star":""}
                                        onClick={()=>setYourRating(n)}
                                        />
                                    ))
                                }
                            </div>

                            {
                            imgPreview?
                            (<img src={imgPreview}></img>):
                            (<label 
                            className="upload-img-div"
                            >
                                upload image <FiUpload/>
                                <input type="file" hidden onChange={imgUploadHandler}/>
                            </label>)}<br/>
                            <textarea
                            style={{width:"400px", padding:"1rem"}}
                            placeholder="Share your experience..."
                            value={yourReview}
                            name="desc"
                            onChange={(e)=>setYourReview(e.target.value)}
                            />

                            <div className="review-actions">
                                <button type="submit"
                                >Submit</button>
                                <button type="button"
                                onClick={()=>setShowReviewBox(false)}
                                >Cancel</button>

                            </div>
                        </form>
                    )
                }
                
            </div>
        </div>

        <div className="prod-det-right">
            <div style={{ fontSize: "50px" }}>{product.name}</div>
            <div>from {product.brand}</div>

            <div style={{ fontSize: "43px", fontWeight: "900", color: '#6b1d4d' }}>₹ {product.price}</div>
            {/* Rating Logic*/}
            <div style={{fontSize: "25px"}}>Rating: </div>
            {rating != null ? (<div className="stars">
                 {
                    [...Array(fullStars)].map((_,i)=>(
                        <span key={"f"+i}><IoStar/></span>
                    ))
                 }
                 {
                 hasHalfStar&& <span><IoStarHalf/></span>
                 }
                 {
                    [...Array(emptyStars)].map((_,i)=>(
                        <span key={"e"+i}><IoStarOutline/></span>
                    ))
                 }
                 <span className="rating-number">{rating.rating}</span>
                 <span className="rating-number">({rating.totalRatings})</span>

            </div>):
            (
                <div style={{fontSize: "15px"}}>(No ratings yet)</div>
            )
            }
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


            <div>
                <h2>Customer Reviews:</h2>

                
                {
                    Comments.length==0?
                    (<div>No Comments yet</div>):
                    (<div>
                        {
                          Comments.map((comment)=>(
                         <CommentBody key={comment.id} comment={comment}/>))
                        }
                    </div>)
                }

            </div>
        </div>


    </div>)
}