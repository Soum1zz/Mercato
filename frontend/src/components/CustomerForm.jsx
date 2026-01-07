import '../styles/customerForm.css'
import { getToken } from "../auth/authService";
import { jwtDecode } from "jwt-decode";
export default function CustomerForm({ user, isForm, setForm, imageFile }) {
  const btnHandler = () => {
    setForm(true);
  }
  return (<div>
    <h2>My Profile</h2>
    <form className="customer-right"

      onSubmit={async (e) => {
        console.log(isForm);
        e.preventDefault();
        if (!isForm) return;
        const form = e.currentTarget;
        const rawFormData = new FormData(form);

        const userData = {
          name: rawFormData.get("name"),
          email: rawFormData.get("email"),
          phoneNumber: rawFormData.get("number"),
          pinCode: Number(rawFormData.get("pinCode").trim()),
          address: rawFormData.get("address"),
        };

        const dataToSend = new FormData();

        dataToSend.append(
          "user",
          new Blob([JSON.stringify(userData)], { type: "application/json" }),
          "user.json"
        );


        if (imageFile) {
          dataToSend.append("image", imageFile);
        }
        try{const response = await fetch("http://localhost:8080/api/me", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`
          },
          body: dataToSend
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
        {isForm === false ?
          (<div className="prof-btn"  onClick={btnHandler}>Edit Profile</div>) :
          (<button className="prof-btn" type="submit"
          >Save Changes</button>)}
      </div>
    </form>

    <p style={{
      transform: "translateX(40%)",
      color: " rgba(20, 9, 37, 0.521)"
    }}>Change your password</p>
  </div>)
}

