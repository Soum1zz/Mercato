import '../styles/customer.css';
import toast from "react-hot-toast";
import { getCurrentUser } from "../auth/authService";
import { useState } from 'react';
import Loader from './Loader';
import { requestResetLink as apiRequestResetLink } from '../api/authApi';
import { updateCustomerProfile } from '../api/customerApi';

export default function CustomerForm({ user, isForm, setForm }) {
  const [loading, setLoading] = useState(false);

  const btnHandler = () => {
    setForm(true);
  };

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
      await apiRequestResetLink(resetEmail);
      toast.success("Link sent please check your email!!");
    } catch (err) {
      const message = err.response?.data;
      toast.error(message || "Link can't be sent at this moment!!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-form-wrap">
      {loading && (
        <div className="customer-loader-overlay">
          <Loader className="inline-loader" />
        </div>
      )}
      <h2>My Profile</h2>
      <form
        className="customer-right"
        onSubmit={async (e) => {
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

          try {
            await updateCustomerProfile(userData);
            alert("sucessfully updated");
          } catch (err) {
            console.log(err);
            alert(err.response?.status || "Update failed");
          }
          setForm(false);
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
        <div>
          {isForm === true && (
            <button className="prof-btn" type="submit">
              Save Changes
            </button>
          )}
        </div>
        {isForm === false && (
          <button type="button" className="prof-btn" onClick={btnHandler}>
            Edit Profile
          </button>
        )}
      </form>

      <p className="password-change-text" onClick={requestResetLink}>
        Change your password
      </p>
    </div>
  );
}
