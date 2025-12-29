import { useState } from "react"
import '../styles/customerForm.css'
export default function CustomerForm(){
    const [isForm, setForm]= useState(false);
    const btnHandler=()=>{
        setForm(!isForm);
    }
    return(<div>
        <h2>My Profile</h2>
        <div className="customer-right">
            <div className="customer-right-fields">
            <label>Name:</label>
              <input disabled={isForm===false}/>
            </div>
            <div className="customer-right-fields">
            <label>Phone Number:</label>
              <input  disabled={isForm===false}/>
            </div>
            <div className="customer-right-fields">
            <label>Email Address:</label>
              <input disabled={isForm===false}/>
            </div>
            <div className="customer-right-fields">
            <label>Address:</label>
              <input disabled={isForm===false}/>
            </div>
            <div className="customer-right-fields">
            <label>Pin Code:</label>
              <input disabled={isForm===false}/>
            </div>
        </div>
        <div onClick={btnHandler}>
            {!isForm?
            (<button className="prof-btn">Edit Profile</button>):
            (<button className="prof-btn">Save Changes</button>)}
        </div>
        <p style={{    transform: "translateX(36%)",
        color: " rgba(20, 9, 37, 0.521)"
}}>Change your password</p>
    </div>)
}

