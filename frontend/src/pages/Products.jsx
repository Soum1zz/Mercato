import { useEffect, useState } from "react"
import ProductCard from "../components/ProductCard";
import "../styles/products.css"
export default function Products(){
    const[products, setProducts]= useState([]);
    const[loading, setLoading]= useState(true);

    useEffect(()=>{
        const fetProducts= async()=>{
            try{
                const response= await fetch("http://localhost:8080/api/products")
                if(!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data= await response.json();
                setProducts(data);
            }catch(e){
                console.error("Fetch error:",e);
                
            }
            finally{
                setLoading(false);
            }
        };
        fetProducts();
    },[]
);
    if(loading) return <p>Loading products.....</p>
   console.log(products);
    return (
        <div>
           <h2> All Products</h2>
           <div className="prods-div">
            {
                products.map((product)=>(
                    <ProductCard key={product.id} product={product}/>
                ))
            }
           </div>
        </div>
    )
}