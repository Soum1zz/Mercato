
import '../styles/customer.css'
import toast from "react-hot-toast";
import { getToken, getCurrentUser } from "../auth/authService";
import { useState } from 'react';
import Loader from './Loader';
export default function CustomerForm({ user, isForm, setForm }) {
  const [loading, setLoading]= useState(false)
  const btnHandler = () => {
    setForm(true);
  }
  const requestResetLink = async () => {
    const currentUser = getCurrentUser();
    const resetEmail = user?.email || currentUser?.sub || currentUser?.email;

    if (!resetEmail) {
      toast.error("Email not found. Please log in again.");
      return;
    }

    setLoading(true);
    localStorage.setItem("email", resetEmail);

    try {
      const resp = await fetch("http://localhost:8080/api/link-req", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      if (resp.status === 200) {
        toast.success("Link sent please check your email!!");
      } else {
        const message = await resp.text();
        toast.error(message || "Link can't be sent at this moment!!");
      }
    } catch {
      toast.error("Link can't be sent at this moment!!");
    } finally {
      setLoading(false);
    }
  };
  return (<div className="customer-form-wrap">
    {loading && (
      <div className="customer-loader-overlay">
        <Loader className="inline-loader" />
      </div>
    )}
    <h2>My Profile</h2>
    <form className="customer-right"

      onSubmit={async (e) => {
        console.log(isForm);
        e.preventDefault();
        if (!isForm) return;
        const form = e.currentTarget;

        const userData = {
          name: form.elements.name.value,
          email: form.elements.email.value,
          phoneNumber: form.elements.number.value,
          pinCode: Number(form.elements.pinCode.value.trim()),
          address: form.elements.address.value,
        };

        

        try{const response = await fetch("http://localhost:8080/api/me", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
          },
          body: JSON.stringify(userData)
        });
        if(response.ok){
            alert("sucessfully updated")
        }else{
            alert(response.status);
        }
        
        }catch(e){
          console.log(e);
        }
        setForm(false)
      }}
    >
      <div className="customer-right-fields">
        <label>Name:</label>
        <input disabled={isForm === false} name="name" defaultValue={user?.name} />
      </div>
      <div className="customer-right-fields">
        <label>Phone Number:</label>
        <input disabled={isForm === false} name="number" defaultValue={user?.phoneNumber} />
      </div>
      <div className="customer-right-fields">
        <label>Email Address:</label>
        <input disabled={isForm === false} name="email" defaultValue={user?.email} />
      </div>
      <div className="customer-right-fields">
        <label>Address:</label>
        <input disabled={isForm === false} name="address" defaultValue={user?.address} />
      </div>
      <div className="customer-right-fields">
        <label>Pin Code:</label>
        <input disabled={isForm === false} name="pinCode" defaultValue={user?.pinCode} />
      </div>
      <div >
        {isForm === true &&
          (<button className="prof-btn" type="submit"
          >Save Changes</button>)}
      </div>
        { isForm === false&&
        <button type='button' className="prof-btn"  onClick={btnHandler}>Edit Profile</button>
        }
        </form>

    <p className="password-change-text"
    
    onClick={
      requestResetLink
    }
    
    
    >Change your password</p>
  </div>)
}

