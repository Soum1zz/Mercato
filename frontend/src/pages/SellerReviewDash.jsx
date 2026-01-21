import {  useLocation, useNavigate } from 'react-router-dom';
import '../styles/sellerReqDash.css'
import { useEffect, useState } from 'react';
import { getToken, isTokenExpired } from '../auth/authService';
export default function SellerReviewDash() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showCert, setCert] = useState(false);
  const [certImg, setCertImg] = useState(null);
  const verifyHandler= async()=>{
    try{const res= await fetch(`http://localhost:8080/admin/sellers/${sellerReq.userId}/approve`,
      {method:"PUT",
      headers: {
        "Authorization": `Bearer ${getToken()}`,
      }
    }
  );
  if(!res.ok){
    throw new Error("Verification error");
  }
  navigate("/admin");
  }catch(e){
     console.error(e);
  }
    
  }
  if (!state?.sellerReq) {
    navigate("/admin");
    // return null;

  }
  const { sellerReq } = state;
  const imgUrl = sellerReq ? `http://localhost:8080/api/user/${sellerReq.userId}/image` : null;
  useEffect(()=>{
    const token=getToken();
    if(!token|| isTokenExpired(token)){
      navigate("/auth");
      return;
    }
    const fetchCert= async()=>{
      try{ const res=await fetch(`http://localhost:8080/admin/seller/${sellerReq.userId}/certificate`,
    {
      headers: {
        "Authorization": `Bearer ${getToken()}`,
      }
    }
  );
  if(!res.ok){
    throw new Error("Failed to fetch certificates");
  }
  const url= await res.text();
  setCertImg(url);
    }catch(e){
      console.error(e);
    }
  };
    
  fetchCert();
  
  },[sellerReq?.userId])
  return (
    <div className='sell-div'>
      <div className="sell-det">
        <div>
          <img src={imgUrl} alt="" className="sell-img" />
        </div>
        <div><div>
          <b>Seller name: </b>{sellerReq.name}

        </div>
          <div>
            <b> Seller address: </b> {sellerReq.address}

          </div>
          <div>
            <b>Seller pincode:</b>  {sellerReq.pinCode}

          </div>
          <div>
            <b>Business email: </b> {sellerReq.email}

          </div>
          <div>
            <b>Business phone number:</b> {sellerReq.phoneNumber}

          </div></div>


      </div>
      <div className="sell-doc">
        <div>Seller's uploaded tax document :</div>
        {
          !certImg ? (
            <div>
              No doc provided
            </div>
          ) :
            (
              <div>
                
                {
                  !showCert?(<button
                  className='view-btn'
                  onClick={() => setCert(true)}
                >view</button>):(
                    <div>
                      <img src={certImg}
                        style={{ maxWidth: "100%", maxHeight: "70vh" }}
                      />
                      <button onClick={() => setCert(false)}>
                        Close
                      </button>
                    </div>
                  )
                }
              </div>
            )
        }
      </div>
      <div className="acc-div">
        <p
          style={{ color: "black", fontSize: "20px" }}
        > Please check the documents submitted by the seller and approve them accordingly</p>
        <div className='acc-btn-grp'>
          <button className="acc-btn"
          onClick={verifyHandler}
          >Verify Seller</button>
          <button className="acc-btn">Reject Seller</button>
        </div>

      </div>
    </div>
  )
}