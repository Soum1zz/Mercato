import '../styles/productCard.css'
import {useNavigate} from "react-router-dom"
export default function ProductCard({product}){
    const navigate=useNavigate();
    if(!product) return null;
const imageUrl = `http://localhost:8080/api/product/${product.id}/image`;    return(
        <div className='prod-card'>
            <img src={imageUrl} width={300}/>
            <h1>{product.name}</h1>
            <h2>{product.price}</h2>
            <button
            onClick={()=>{
                 navigate(`/product/${product.id}`);
            }}
            > View</button>
        </div>
    )
}