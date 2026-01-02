import '../styles/productCard.css'
import { useNavigate } from "react-router-dom"
export default function ProductCard({ product }) {
    const navigate = useNavigate();
    if (!product) return null;
    const imageUrl = `http://localhost:8080/api/product/${product.id}/image`; return (
        <div className='prod-card'>
            <img src={imageUrl} width={150} />
            <div className='text-field'>
                <div style={{ fontSize: "25px", color: "rgb(112, 114, 116)" }}>{product.name}</div>
                <div style={{ fontSize: "23px", color: "" }}>₹
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