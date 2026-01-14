import { useEffect, useState } from 'react'
import SellerReq from '../components/SellerReq'
import '../styles/adminDash.css'
import { getToken } from '../auth/authService'
export default function AdminDash() {
    const[requests, setRequests]= useState([]);
    useEffect(() => {

        const fetchReq = async () => {
            try{const req = await fetch("http://localhost:8080/admin/seller/requests",
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            )
            if(!req.ok){
                throw new Error("Failed to fetch seller requests")
            }
            const data= await req.json();
            setRequests(data);
            }catch(e){
                console.error(e);
            }
        }
        fetchReq();
    }, [])
    return (
        <div className="admin-div">
            <h1> hello mr. admin</h1>

            <div className="stat-div">
                <div className="stat-sub"
                    style={{ backgroundColor: "#C89B92" }}
                >
                    <p>Number of Users</p>
                </div>
                <div className="stat-sub"
                    style={{ backgroundColor: "#A8C892" }}
                >
                    <p>Number of Orders</p>
                </div>
                <div className="stat-sub"
                    style={{ backgroundColor: "#92A9C8" }}
                >
                    <p>Number of Sellers</p>
                </div>
            </div>

            <div className="sell-auth-div">
                <h2>Seller Verification requests:</h2>
                <div>
                {requests.map((req)=>(
                            <SellerReq key={req.id} request={req}/>
                ))
                    }

                </div>
                    
                
            </div>

        </div>
    )
}