import { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { IoReturnUpBack } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/auth.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  // const email = localStorage.getItem("email");
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const notPassMatch =
    passwordData.password !== passwordData.confirmPassword;
  const ConfEmpty = passwordData.confirmPassword.length === 0;

  const hasNumber = /\d/.test(passwordData.password);
  const hasSpecial = /[{(!@#$%^&*|\=})\-]/.test(passwordData.password);
  const hasEightChar = passwordData.password.length >= 8;
  const hasEmptySpace = !passwordData.password.includes(" ");

  const strengthScore = [
    hasNumber,
    hasSpecial,
    hasEightChar,
    hasEmptySpace,
  ].filter(Boolean).length;

  const strengthColorHandler = () => {
    if (passwordData.password.length === 0) return "transparent";
    if (strengthScore < 3) return "red";
    if (strengthScore === 3) return "orange";
    return "transparent";
  };

  const handlePasswordCheck = () => {
    if (
      passwordData.password === passwordData.confirmPassword ||
      ConfEmpty
    )
      return "transparent";
    else return "red";
  };

  const passwordWarnColorHandler = () => {
    if (passwordData.password.length === 0) return "black";
    return "transparent";
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleShow = () => setShowPassword(true);
  const handleHide = () => setShowPassword(false);

  const handleReset = async () => {

    // if (!email) {
    //   toast.error("Session expired");
    //   navigate("/auth");
    //   return;
    // }
    if(!token){
      toast.error("Wrong url detected");
      navigate("/auth");
      return;
    }

    if (notPassMatch || ConfEmpty) {
      toast.error("Fix password errors first");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8080/api/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pwd: passwordData.password,
            token: token
          }),
        }
      );

      if (res.ok) {
        toast.success("Password reset successful!");
        localStorage.removeItem("email");
        navigate("/auth");
      } else {
        const text = await res.text();
        toast.error(text);
      }
    } catch (e) {
      toast.error("Network error", e);
    }

    setLoading(false);
  };

  return (
    <div className="auth-div">
      <form className="form-grid" onSubmit={(e) => { e.preventDefault(); handleReset(); }}>

        {/* <button
          className="back-btn"
          type="button"
          onClick={() => navigate("/")}
        >
          <IoReturnUpBack />
          Return to home
        </button> */}

        <h2>Reset your password</h2>

        <div className="form-group">

          {/* NEW PASSWORD */}
          <label>
            New Password:
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter new password"
              onChange={handlePasswordChange}
            />

            <button
              type="button"
              className="eye-btn"
              onMouseDown={handleShow}
              onMouseUp={handleHide}
              onTouchStart={handleShow}
              onTouchEnd={handleHide}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>

            <p
              style={{ color: `${passwordWarnColorHandler()}`, marginTop: "1.8rem" }}
              className="pass-instr"
            >
              Password should be of length 8 and contain Alphanumeric
              characters and special characters but not spaces
            </p>

            <p
              style={{ color: `${strengthColorHandler()}`, marginTop: ".5rem" }}
              className="pass-warn"
            >
              Please strengthen your password !!
            </p>
          </label>

          {/* CONFIRM PASSWORD */}
          <label>
            Confirm Password:
            <input
              disabled={strengthScore <= 3}
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              onChange={handlePasswordChange}
            />

            <p
              style={{ color: `${handlePasswordCheck()}`,
                marginTop: "1rem"
               }}
              className="pass-warn"
            >
              Please correct your password !!
            </p>
          </label>

        </div>

        <button
          style={{marginTop:"1.4rem"}}

          className="auth-btn"
          type="submit"
          disabled={notPassMatch || ConfEmpty || loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <button
          className="auth-sub-text"
          type="button"
          onClick={() => navigate("/auth")}
        >
          Back to Login
        </button>

      </form>
    </div>
  );
}