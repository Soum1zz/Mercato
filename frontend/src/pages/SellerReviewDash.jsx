import {  useLocation, useNavigate } from 'react-router-dom';
import '../styles/sellerReqDash.css'
import { useEffect, useState } from 'react';
import { getToken, isTokenExpired } from '../auth/authService';
import { approveSeller, getSellerCertificate } from '../api/adminApi';
import { getUserImageUrl } from '../api/customerApi';

export default function SellerReviewDash() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const sellerReq = state?.sellerReq;
  const [showCert, setCert] = useState(false);
  const [certImg, setCertImg] = useState(null);
  const verifyHandler= async()=>{
    try{
      await approveSeller(sellerReq.userId);
      navigate("/admin");
    }catch(e){
      console.error(e);
    }
    
  }
  const imgUrl = sellerReq ? getUserImageUrl(sellerReq.userId) : null;
  useEffect(()=>{
    const token=getToken();
    if(!token|| isTokenExpired(token)){
      navigate("/auth");
      return;
    }
    if (!sellerReq) {
      navigate("/admin");
      return;
    }
    const fetchCert= async()=>{
      try{
        const res = await getSellerCertificate(sellerReq.userId);
        setCertImg(res.data);
      }catch(e){
        console.error(e);
      }
    };
    
  fetchCert();
  
  },[navigate, sellerReq])
  if (!sellerReq) {
    return null;
  }
  return (
    <div className='sell-div'>
      <div className="seller-review-header">
        <div>
          <h1>Seller Review</h1>
          <p>Review the seller profile and uploaded document before taking action.</p>
        </div>
      </div>
      <div className="sell-det">
        <div>
          <img src={imgUrl} alt={sellerReq.name} className="sell-img" />
        </div>
        <div className="seller-info-list"><div>
          <span>Seller name</span>{sellerReq.name}

        </div>
          <div>
            <span>Seller address</span> {sellerReq.address}

          </div>
          <div>
            <span>Seller pincode</span>  {sellerReq.pinCode}

          </div>
          <div>
            <span>Business email</span> {sellerReq.email}

          </div>
          <div>
            <span>Business phone number</span> {sellerReq.phoneNumber}

          </div></div>


      </div>
      <div className="sell-doc">
        <div>
          <h2>Tax document</h2>
          <p>Seller uploaded certificate for verification.</p>
        </div>
        {
          !certImg ? (
            <div className="empty-doc">
              No doc provided
            </div>
          ) :
            (
              <div>
                
                {
                  !showCert?(<button
                  className='view-btn'
                  onClick={() => setCert(true)}
                >View</button>):(
                    <div className="cert-preview">
                      <img src={certImg}
                        alt="Seller tax certificate"
                      />
                      <button className="view-btn" onClick={() => setCert(false)}>
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
        <p>Please check the documents submitted by the seller and approve them accordingly.</p>
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
