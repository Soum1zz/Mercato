import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import About from "../components/About";
import {useNavigate} from "react-router-dom"
export default function Home(){
    const navigate=useNavigate();
    return(
        <div>

            <Hero/>
            <ProductCard />
            <button onClick={()=>{navigate("/productForm")}}> click me</button> 
            <About />
        </div>
    )
}