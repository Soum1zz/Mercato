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
  updateProductComment,
  getUserCommentOnProduct,
  checkWishlistStatus,
  toggleWishlist,
  getProductImageUrl,
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
        const fetchOwnComment = async () => {
            if (!getCurrentUser()) return;
            try {
                const res = await getUserCommentOnProduct(id);
                const comData = res.data;
                setYourCommentData(comData);
                setYourReview(comData.desc || "");
                setYourRating(comData.rating || 0);
                setImgPreview(comData.imageUrl || comData.imgUrl || null);
            } catch (err) {
                if (err.response?.status === 404) {
                    setYourCommentData(null);
                    return; // user never reviewed
                }
                console.error(err);
            }
        };
        fetchOwnComment();
    }, [id]);
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
    
    const openReviewModal = () => {
        if (!getCurrentUser()) {
            navigate("/auth");
            return;
        }
        if (yourCommentData) {
            setYourReview(yourCommentData.desc || "");
            setYourRating(yourCommentData.rating || 0);
            setImgPreview(yourCommentData.imageUrl || yourCommentData.imgUrl || null);
        } else {
            setYourReview("");
            setYourRating(0);
            setImgPreview(null);
        }
        setShowReviewBox(true);
    };

    const cancelReviewModal = () => {
        if (yourCommentData) {
            setYourReview(yourCommentData.desc || "");
            setYourRating(yourCommentData.rating || 0);
            setImgPreview(yourCommentData.imageUrl || yourCommentData.imgUrl || null);
        } else {
            setYourReview("");
            setYourRating(0);
            setImgPreview(null);
        }
        setShowReviewBox(false);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const rawFormData = new FormData(form);
        if (!getCurrentUser()) {
            navigate("/auth");
            return;
        }
        const commentData = {
            desc: rawFormData.get("desc") || yourReview,
            rating: yourRating,
            imgUrl: imgPreview,
        };
        try {
            if (yourCommentData) {
                const commentId = yourCommentData.commentId || yourCommentData.id;
                const response = await updateProductComment(commentId, commentData);
                toast.success("Review updated!");
                setYourCommentData(response.data);
            } else {
                const response = await addProductComment(product.id, commentData);
                toast.success("Review added!");
                setYourCommentData(response.data);
            }
            setShowReviewBox(false);

            const ratRes = await getProductRating(product.id);
            setRating(ratRes.data);

            const comRes = await getProductComments(product.id);
            setcomments(comRes.data);
        } catch (e) {
            console.error("Comment submit error:", e);
            if (e.response?.status === 409) {
                toast.error("You have already reviewed this product!");
            } else {
                toast.error(yourCommentData ? "Failed to update review" : "Comment not added!");
            }
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
    const imageUrl = getProductImageUrl(id);
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


            <div className="your-review-section">
                <div className="section-title-wrap">
                    <h2 className="reviews-heading">Your Review</h2>
                    {yourCommentData && (
                        <span className="reviews-count-tag">1 submission</span>
                    )}
                </div>

                {!showReviewBox && yourCommentData && (
                    <CommentBody
                        comment={yourCommentData}
                        isOwnReview={true}
                        onEdit={openReviewModal}
                    />
                )}

                {!showReviewBox && !yourCommentData && (
                    <div className="no-user-review-box">
                        <p>You haven't reviewed this product yet. Share your experience with other shoppers!</p>
                        <button className="comment-btn" onClick={openReviewModal}>
                            Write a Review
                        </button>
                    </div>
                )}

                {showReviewBox && (
                    <form className="review-modal" onSubmit={submitHandler}>
                        <div className="review-modal-header">
                            <h3>{yourCommentData ? "Edit Your Review" : "Write a Review"}</h3>
                            <p className="review-modal-sub">Tell us what you think about this product</p>
                        </div>

                        <div className="review-field-group">
                            <label className="review-field-label">Your Rating</label>
                            <div className="star-select">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <IoStar
                                        key={n}
                                        className={n <= yourRating ? "active-star" : ""}
                                        onClick={() => setYourRating(n)}
                                    />
                                ))}
                                <span className="star-hint-text">
                                    {yourRating > 0 ? `${yourRating} of 5 stars` : "Select a rating"}
                                </span>
                            </div>
                        </div>

                        <div className="review-field-group">
                            <label className="review-field-label">Review Attachment (Optional)</label>
                            {imgPreview ? (
                                <div className="review-img-preview-row">
                                    <img src={imgPreview} alt="Review attachment" className="review-img-preview" />
                                    <button type="button" onClick={() => setImgPreview(null)} className="review-remove-img-btn">
                                        Remove Photo
                                    </button>
                                </div>
                            ) : (
                                <label className="upload-img-div">
                                    <FiUpload /> Upload photo
                                    <input type="file" hidden accept="image/*" onChange={imgUploadHandler} />
                                </label>
                            )}
                        </div>

                        <div className="review-field-group">
                            <label className="review-field-label">Your Review</label>
                            <textarea
                                className="review-textarea"
                                placeholder="What did you like or dislike? How did it fit or perform?"
                                value={yourReview}
                                name="desc"
                                rows={4}
                                onChange={(e) => setYourReview(e.target.value)}
                            />
                        </div>

                        <div className="review-actions">
                            <button type="submit" className="review-submit-btn">
                                {yourCommentData ? "Update Review" : "Submit Review"}
                            </button>
                            <button type="button" className="review-cancel-btn" onClick={cancelReviewModal}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
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


            <div className="customer-reviews-section">
                <div className="section-title-wrap">
                    <h2 className="reviews-heading">Customer Reviews</h2>
                    {rating?.totalRatings != null && (
                        <span className="reviews-count-tag">
                            {rating.totalRatings} {rating.totalRatings === 1 ? "Review" : "Reviews"}
                        </span>
                    )}
                </div>

                {(() => {
                    const otherReviews = Comments.filter((c) => {
                        const commentId = c.commentId || c.id;
                        const yourId = yourCommentData?.commentId || yourCommentData?.id;
                        if (yourId && commentId === yourId) return false;
                        if (yourCommentData?.userId && c.userId === yourCommentData.userId) return false;
                        return true;
                    });

                    return otherReviews.length === 0 ? (
                        <div className="no-reviews-box">
                            <p>No other customer reviews yet for this product.</p>
                        </div>
                    ) : (
                        <div className="reviews-list-container">
                            {otherReviews.map((comment) => (
                                <CommentBody key={comment.commentId || comment.id} comment={comment} />
                            ))}
                        </div>
                    );
                })()}

            </div>
        </div>


    </div>)
}