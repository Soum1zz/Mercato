import { useNavigate } from "react-router-dom"

export default function SellerReq(){
    const navigate= useNavigate();
       return (
        <div className="req-div">
            <div>
            <div className="req-name">Name</div>
            <div className="req-email">email</div>
            </div>
            <div>
                <button className="req-btn"
                onClick={()=>{
                navigate("/sellers")
                }}
                >View Details</button>
            </div>
            

        </div>
       )
}