import SellerReq from '../components/SellerReq'
import '../styles/adminDash.css'

export default function AdminDash(){
    return(
        <div className="admin-div">
        <h1> hello mr. admin</h1>
           
            <div className="stat-div">
                    <div className="stat-sub"
                    style={{backgroundColor: "#C89B92"}}
                    >
                        <p>Number of Users</p>
                    </div>
                    <div className="stat-sub"
                    style={{backgroundColor: "#A8C892"}}
                    >
                        <p>Number of Orders</p>
                    </div>
                    <div className="stat-sub"
                    style={{backgroundColor: "#92A9C8"}}
                    >
                        <p>Number of Sellers</p>
                    </div>
            </div>

            <div className="sell-auth-div">
                     <h2>Seller Verification requests:</h2>
                     <div>
                        <SellerReq/>
                     </div>
            </div>

        </div>
    )
}