import '../styles/productCard.css'
import { useNavigate } from "react-router-dom"
import { getProductImageUrl } from "../api/productApi"

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const name= product.name.length>30?(product.name.substring(0,30)+"..."):product.name;

    if (!product) return null;
    const imageUrl = getProductImageUrl(product.id);
    return (
        <div className='prod-card'>
            <img src={imageUrl} width={120} />
            <div className='text-field'>
                <div style={{ fontSize: "19px", color: "rgb(112, 114, 116)" }}>{name}</div>
                <div style={{ fontSize: "20px", color: "#641d4d" }}>₹
                    {product.price}</div>
            </div>

            <button
                className='prod-btn'
                onClick={() => {
                    navigate(`/product/${product.id}`);
                }}
            > View</button>
        </div>
    )
}