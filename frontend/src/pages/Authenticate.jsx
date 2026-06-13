import { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { IoReturnUpBack } from "react-icons/io5";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { saveToken } from "../auth/authService";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import OtpInput from "../components/otpInput";
export default function Authenticate() {
  // const [loginForm, setLoginForm] = useState(null);
  // const [signupForm, setSignUpForm] = useState(null);

  const navigate = useNavigate();
  const [Link,setLink] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  const notPassMatch = passwordData.password !== passwordData.confirmPassword;
  const ConfEmpty = passwordData.confirmPassword.length === 0;
  const hasNumber = /\d/.test(passwordData.password);
  const hasSpecial = /[{(!@#$%^&*|=})-]/.test(passwordData.password);
  const hasEightChar = passwordData.password.length >= 8;
  const hasEmptySpace = !passwordData.password.includes(" ");
  const strengthScore = [
    hasNumber,
    hasSpecial,
    hasEightChar,
    hasEmptySpace,
  ].filter(Boolean).length;
  const [role, setRole] = useState("CUSTOMER");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("login");

  const strengthColorHandler = () => {
    if (passwordData.password.length === 0) return "transparent";
    if (strengthScore < 3) return "red";
    if (strengthScore === 3) return "orange";
    return "transparent";
  };
  const handlePasswordCheck = () => {
    if (passwordData.password === passwordData.confirmPassword || ConfEmpty)
      return "transparent";
    else return "red";
  };

  const passwordWarnColorHandler = () => {
    if (passwordData.password.length === 0) return "black";
    return "transparent";
  };
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleShow = () => setShowPassword(true);
  const handleHide = () => setShowPassword(false);

  const requestOtp = async () => {
    setLoading(true);
    localStorage.setItem("email", email);

    try {
      const resp = await fetch("http://localhost:8080/api/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (resp.status === 200) {
        toast.success("OTP generated please check your email!!");
        setStep("otp");
      } else {
        toast.error("OTP can't be generated at this moment!!");
      }
    } catch {
      toast.error("OTP can't be generated at this moment!!");
    } finally {
      setLoading(false);
    }
  };

  const requestResetLink = async () => {
    setLoading(true);
    localStorage.setItem("email", email);

    try {
      const resp = await fetch("http://localhost:8080/api/link-req", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
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

 
  return (
    <div className="auth-div">
      {loading && (
        <div className="auth-loader-overlay">
          <Loader className="inline-loader" />
        </div>
      )}
      <form
        className="form-grid"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const rawFormData = new FormData(form);
          console.log(rawFormData.get("name"));
          if (step === "signup") {
            setLoading(true);

            const payLoad = {
              name: rawFormData.get("name"),
              phoneNumber: Number(rawFormData.get("number")),
              address: rawFormData.get("address"),
              pinCode: Number(rawFormData.get("pincode").trim()),
              email: localStorage.getItem("email"),
              password: rawFormData.get("password"),
              role: rawFormData.get("role"),
            };

            try {
              const response = await fetch(
                "http://localhost:8080/auth/register",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(payLoad),
                },
              );
              if (response.ok) {
                toast.success("You have successfully signed up to Mercato");
                setStep("login");
              } else {
                if (response?.status === 409)
                  toast.error("Email already exists!");
                else toast.error("Sign up failed");
              }
            } catch (e) {
              if (e.response?.status === 409)
                toast.error("Email already exists!");
              else toast.error("Sign up failed");
            } finally {
              setLoading(false);
            }
          } else if(step === "login") {
            setLoading(true);
            const payLoad = {
              email: rawFormData.get("email"),
              password: rawFormData.get("password"),
            };

            try {
              const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(payLoad),
              });
              if (response.ok) {
                const result = await response.json();
                toast.success("You have successfully logged in to Mercato");
                saveToken(result.token);
                const decoded = jwtDecode(result.token);
                const role = decoded.role;
                console.log(role);
                if (role === "ADMIN") {
                  navigate("/admin");
                } else if (role === "SELLER") {
                  navigate("/seller");
                } else {
                  navigate("/customer");
                }
              } else {
                const errorText = await response.text();
                console.error(
                  "Server Error Status:",
                  response.status,
                  "Message:",
                  errorText,
                );
                toast.error("Log in failed");
              }
            } catch (e) {
              console.log("Network Error: ", e);
              toast.error("Log in failed");
            } finally {
              setLoading(false);
            }
          }
        }}
      >
        <button
          className="back-btn"
          type="button"
          onClick={() => navigate("/")}
        >
          <IoReturnUpBack />
          Return to home
        </button>
        {step === "signup" && (
          <>
            {" "}
            <h2>Create your account </h2>
            <div className="form-group">
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  required
                />
              </label>
              <label>
                Phone Number:
                <input
                  type="number"
                  name="number"
                  placeholder="Enter your number"
                  required
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  placeholder="Enter your address"
                  required
                />
              </label>
              <label>
                Pincode:
                <input
                  type="number"
                  name="pincode"
                  placeholder="Enter your pincode"
                  required
                />
              </label>

              <div className="radio-btn">
                {" "}
                Are you are a seller?
                <label className="auth-radio">
                  <input
                    type="radio"
                    name="role"
                    value="SELLER"
                    checked={role === "SELLER"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Yes
                </label>
                <label className="auth-radio">
                  <input
                    type="radio"
                    name="role"
                    value="CUSTOMER"
                    checked={role === "CUSTOMER"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  No
                </label>
              </div>

              <label>
                Password:
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  required
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
                  style={{ color: `${passwordWarnColorHandler()}` }}
                  className="pass-instr"
                  aria-live="assertive"
                >
                  Password should be of length 8 and contain Alphanumeric
                  characters and special characters(e.g. !?) but not empty
                  spaces
                </p>
                <p
                  style={{ color: `${strengthColorHandler()}` }}
                  className="pass-warn"
                  aria-live="assertive"
                >
                  Please strengthen your password !!
                </p>
              </label>

              <label>
                Confirm Password:
                <input
                  disabled={strengthScore <= 3}
                  type={showPassword ? "text" : "password"}
                  onChange={handlePasswordChange}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                />
                <p
                  style={{ color: `${handlePasswordCheck()}` }}
                  className="pass-warn"
                  aria-live="assertive"
                >
                  Please correct your password !!
                </p>
              </label>
            </div>
            <br />
            <button
              className="auth-btn"
              type="submit"
              disabled={notPassMatch || ConfEmpty || loading}
            >
              {" "}
              Sign up
            </button>
            <button
              className="auth-sub-text"
              type="button"
              onClick={() => {
                setStep("login");
              }}
            >
              Old User? Log in
            </button>
          </>
        )}

        {step === "login" && (
          <>
            <h2>Login with your account </h2>
            <div className="form-group">
              <label>
                Email:
                <input type="email" placeholder="abc@gmail.com" name="email" required={true}/>
              </label>
              <label>
                Password:
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  required={true}
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
              </label>
            </div>
            <div className="auth-sub-text" 
            onClick={()=>{
              setStep("email");
              setLink(true);
            }}
            >
              Forgot Password?
            </div>

            <br />
            <button className="auth-btn" type="submit" disabled={loading}>
              {" "}
              Login
            </button>
            <button
              className="auth-sub-text"
              type="button"
              onClick={() => {
                setStep("email");
                setLink(false);
              }}
            >
              New User? Sign up
            </button>
          </>
        )}
        {step === "email" && (
          <div className="email-div">
            <h2>Email verification</h2>
            <label>
              Your email :
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                placeholder="Enter your email"
                required
              />
            </label>

            {
            Link==false&&<button
              type="button"
              onClick={requestOtp}
              className="auth-btn"
              disabled={loading}
            >
              Get OTP
            </button>
            }
            {
              Link==true&&<button
              type="button"
              onClick={requestResetLink}
              className="auth-btn"
              disabled={loading}
            >
              Get Link
            </button>
            }
          </div>
        )}
        {step === "otp" && <OtpInput setStep={setStep}/>}
      </form>
    </div>
  );
}
