{/* <button onClick={()=>{navigate("/productForm")}}> add me</button>  */}
            {/* <div>
                {products&& products.length>0?(
                            products.map((product)=>(
                                <ProductCard key={product.id} product={product}/>
                            ))):
                                (<p> No product available</p>)
                            
            }
            </div> */}

import Hero from "../components/Hero";
import About from "../components/About";
import Contact from "../components/ContactUs"
import {useNavigate} from "react-router-dom"
import { useEffect, useRef } from "react";
export default function Home({products, contactRef, aboutRef}){
 
    useEffect(()=>{

        const reveals= document.querySelectorAll(".reveal");
        const observer= new IntersectionObserver(
            entries=> {
                entries.forEach(
                    entry=>{
                        if(entry.isIntersecting){
                            entry.target.classList.add("active");
                        }else{
                            entry.target.classList.remove("active");
                        }
                    }
                )
            },{threshold: 0.25}
        );
        reveals.forEach(el=>observer.observe(el));
        return()=> observer.disconnect();

    },
    []
);
    const navigate=useNavigate();
    return(
        <div>
            <Hero/>
            <div ref={aboutRef}><About /></div>
            <div ref={contactRef}><Contact /></div> 
        </div>
    )
}