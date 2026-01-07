import { useState } from "react"
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { IoReturnUpBack } from "react-icons/io5";
import "../styles/auth.css"
import { useNavigate } from "react-router-dom";

import { saveToken } from "../auth/authService";
import { jwtDecode } from "jwt-decode";
export default function Authenticate() {


    const [loginForm, setLoginForm] = useState(null);
    const [signupForm, setSignUpForm] = useState(null);


    const navigate = useNavigate();
    const [isLogin, setLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({ password: "", confirmPassword: "" });
    const notPassMatch = passwordData.password !== passwordData.confirmPassword;
    const ConfEmpty = passwordData.confirmPassword.length === 0;
    const hasNumber = /\d/.test(passwordData.password);
    const hasSpecial = /[{(!@#$%^&*|\=})\-]/.test(passwordData.password);
    const hasEightChar = passwordData.password.length >= 8;
    const hasEmptySpace = !passwordData.password.includes(" ");
    const strengthScore = [hasNumber, hasSpecial, hasEightChar, hasEmptySpace].filter(Boolean).length;
    const [role, setRole] = useState("CUSTOMER");

    const strengthColorHandler = () => {
        if (passwordData.password.length === 0) return "transparent";
        if (strengthScore < 3) return "red";
        if (strengthScore === 3) return "orange";
        return "transparent";
    }
    const handlePasswordCheck = () => {
        if (passwordData.password === passwordData.confirmPassword || ConfEmpty) return "transparent";
        else return "red";
    }

    const passwordWarnColorHandler = () => {
        if (passwordData.password.length === 0) return "black";
        return "transparent";
    }
    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    }

    const handleShow = () => setShowPassword(true);
    const handleHide = () => setShowPassword(false);
    return (
        <div className="auth-div">
            <form className="form-grid" onSubmit={async (e) => {
                e.preventDefault();

                const form = e.currentTarget;
                const rawFormData = new FormData(form);
                                console.log(rawFormData.get("name"));
                if (isLogin) {
                    const payLoad = {
                        name: rawFormData.get("name"),
                        phoneNumber: Number(rawFormData.get("number")),
                        address: rawFormData.get("address"),
                        pinCode: Number(rawFormData.get("pincode").trim()),
                        email: rawFormData.get("email"),
                        password: rawFormData.get("password"),
                        role: rawFormData.get("role")
                    };

                    try {
                        const response = await fetch("http://localhost:8080/auth/register",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(payLoad),
                            }
                        );
                        if (response.ok) {
                            const result = await response.json();
                            console.log("success");
                            window.alert("You have successfully Signed up!");
                        } else {
                            const errorText = await response.text();
                            console.error("Server Error Status:", response.status, "Message:", errorText);
                            alert(`Failed with status ${response.status}. Check backend logs.`);
                        }
                    } catch (e) {
                        console.log("Network Error: ", e);
                    }
                    navigate("/auth");

                } else {
                    if (!rawFormData.get("pincode")) {
                        console.log("Pincode required");
                    }

                    const payLoad = {
                        email: rawFormData.get("email"),
                        password: rawFormData.get("password")
                    };




                    try {
                        const response = await fetch("http://localhost:8080/auth/login",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(payLoad),
                            }
                        );
                        if (response.ok) {
                            const result = await response.json();
                            console.log("success");
                            window.alert("You have successfully loged in!");
                            saveToken(result.token);
                            const decoded = jwtDecode(result.token);
                            const role = decoded.role;
                            if (role === "ADMIN") { navigate("/admin") }
                            else if (role === "SELLER") { navigate("/seller") }
                            else { navigate("/customer") }
                        } else {
                            const errorText = await response.text();
                            console.error("Server Error Status:", response.status, "Message:", errorText);
                            alert(`Failed with status ${response.status}. Check backend logs.`);
                        }
                    } catch (e) {
                        console.log("Network Error: ", e);
                    }


                }


            }
            }>
                <button className="back-btn"
                    type="button"
                    onClick={() => navigate("/")}>
                    <IoReturnUpBack />
                    Return to home
                </button>
                {isLogin ? (<>
                    <h2>Create your account </h2>
                    <div className="form-group">
                        <label>
                            Name:
                            <input type="text" name="name" placeholder="Enter your name" required />
                        </label>
                        <label>
                            Phone Number:
                            <input type="number" name="number" placeholder="Enter your number" required />
                        </label>
                        <label>
                            Address:
                            <input type="text" name="address" placeholder="Enter your address" required />
                        </label>
                        <label>
                            Pincode:
                            <input type="number" name="pincode" placeholder="Enter your pincode" required />
                        </label>
                        <label>
                            Email:
                            <input type="email" placeholder="abc@gmail.com" name="email" required />
                        </label>
                        <div className="radio-btn">  Are you are a seller?
                            <label className="auth-radio"><input type="radio" name="role" value="SELLER" checked={role === "SELLER"} onChange={(e) => setRole(e.target.value)} />Yes</label>
                            <label className="auth-radio"><input type="radio" name="role" value="CUSTOMER" checked={role === "CUSTOMER"} onChange={(e) => setRole(e.target.value)} />No</label>
                        </div>


                        <label>
                            Password:
                            <input
                                type={showPassword ? "type" : "password"} placeholder="Enter your password" name="password" required
                                onChange={handlePasswordChange}
                            />
                            <button type="button"
                                className="eye-btn"
                                onMouseDown={handleShow}
                                onMouseUp={handleHide}
                                onTouchStart={handleShow}
                                onTouchEnd={handleHide}

                            >
                                {showPassword ? (<FaRegEyeSlash />) : (<FaRegEye />)}
                            </button>
                            <p
                                style={{ color: `${passwordWarnColorHandler()}` }}
                                className="pass-instr" aria-live="assertive" >Password should be of length 8 and contain Alphanumeric characters and special characters(e.g. !?) but not empty spaces</p>

                            <p
                                style={{ color: `${strengthColorHandler()}` }}
                                className="pass-warn" aria-live="assertive">Please strengthen your password !!</p>
                        </label>


                        <label>
                            Confirm Password:
                            <input
                                disabled={strengthScore <= 3}
                                type={showPassword ? "text" : "password"}
                                onChange={handlePasswordChange}
                                name="confirmPassword"
                                placeholder="Confirm your password" />
                            <p
                                style={{ color: `${handlePasswordCheck()}` }}
                                className="pass-warn" aria-live="assertive">Please correct your password !!</p>
                        </label>
                    </div>
                    <br />
                    <button className="auth-btn"
                        type="submit" disabled={notPassMatch || ConfEmpty}> Sign up</button>
                    <button className="auth-sub-text" type="button"
                        onClick={() => {
                            setLogin(false);
                        }}
                    >Old User? Log in</button>

                </>) :
                    (<>
                        <h2>Login with your account </h2>
                        <div className="form-group">
                            <label>
                                Email:
                                <input type="email" placeholder="abc@gmail.com" name="email" />
                            </label>
                            <label>
                                Password:
                                <input type={showPassword ? "text" : "password"} placeholder="Enter your password" name="password" />
                                <button type="button"
                                    className="eye-btn"
                                    onMouseDown={handleShow}
                                    onMouseUp={handleHide}
                                    onTouchStart={handleShow}
                                    onTouchEnd={handleHide}

                                >
                                    {showPassword ? (<FaRegEyeSlash />) : (<FaRegEye />)}
                                </button>
                            </label>
                        </div>
                        <button className="auth-sub-text" type="button">Forgot Password?</button>

                        <br />
                        <button className="auth-btn" type="submit"> Login</button>
                        <button className="auth-sub-text" type="button"
                            onClick={() => {
                                setLogin(true);
                            }}
                        >New User? Sign up</button>
                    </>
                    )
                }

            </form>
        </div>
    )
}