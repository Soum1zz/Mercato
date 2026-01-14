export default function CartItem(){
    return(
        <div className="cart-sub-div">
            <img/>
            <div style={{display:"flex",flexDirection:"column",gap: "0.5rem", fontSize:"30px"}}>
                <div>name</div>
                <div style={{fontSize:"15px"}}>Quantity:</div>
            </div>
            <div><button className="cart-btn">Remove</button></div>
            <div style={{color: "#6b1d4d", fontWeight:"bolder"}}>price</div>
            
        </div>
    )
}