import '../styles/sellerReqDash.css'

export default function SellerReviewDash(){
    const sellerImg= "";
    return(
        <div className='sell-div'>
            <div className="sell-det">
                  <div>
                    <img src={sellerImg} alt="" className="sell-img"/>
                  </div>
                  <div><div>
                    Seller name:

                  </div>
                  <div>
                    Seller address:
                    
                  </div>
                  <div>
                    Seller pincode:
                    
                  </div>
                  <div>
                    Business email:
                    
                  </div>
                  <div>
                    Business phone number:
                    
                  </div></div>
                  

            </div>
            <div className="sell-doc">
                <div>Seller's uploaded document :</div>
                {
                    sellerImg?(
                        <div>
                            No doc provided
                        </div>
                    ):
                    (
                        <div>
                            <button>view</button>
                        </div>
                    )
                }
                {/* <img src="" alt="uploaded doc"/> */}
            </div>
            <div className="acc-div">
                <p
                style={{color: "black", fontSize:"20px"}}
                > Please check the documents submitted by the seller and approve them accordingly</p>
                <div className='acc-btn-grp'>
                <button className="acc-btn">Verify Seller</button>
                <button className="acc-btn">Reject Seller</button>
                </div>
                
            </div>
        </div>
    )
}