import { useNavigate } from "react-router-dom"

export default function SellerReq({request}){
    const navigate= useNavigate();
       return (
        <div className="req-div">
            <div>
            <div className="req-name">{request?.name}</div>
            <div className="req-email">{request?.email}</div>
            </div>
            <div>
                <button className="req-btn"
                onClick={()=>{
                navigate("/seller-review",
                {
                    state: { sellerReq:request}
                })
                }}
                >View Details</button>
            </div>
            

        </div>
       )
}