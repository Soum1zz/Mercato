import { useState } from "react"
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { IoReturnUpBack } from "react-icons/io5";

import "../styles/auth.css"
import { useNavigate } from "react-router-dom";
export default function Authenticate() {
    const navigate= useNavigate();
    const [login, setLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({ password: "", confirmPassword: "" });
    const notPassMatch = passwordData.password !== passwordData.confirmPassword;
    const ConfEmpty = passwordData.confirmPassword.length === 0;
    const hasNumber = /\d/.test(passwordData.password);
    const hasSpecial = /[{(!@#$%^&*|\=})\-]/.test(passwordData.password);
    const hasEightChar = passwordData.password.length >= 8;
    const hasEmptySpace= !passwordData.password.includes(" ");
    const strengthScore = [hasNumber, hasSpecial, hasEightChar, hasEmptySpace].filter(Boolean).length;
    const strengthColorHandler = () => {
        if (passwordData.password.length === 0) return "transparent";
        if (strengthScore < 3) return "red";
        if (strengthScore === 3) return "orange";
        return "transparent";
    }
    const handlePasswordCheck = () => {
        if (passwordData.password === passwordData.confirmPassword|| ConfEmpty ) return "transparent";
        else return "red";
    }

    const passwordWarnColorHandler = ()=>{
        if(passwordData.password.length===0)return "black";
        return "transparent";
    }
    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    }

    const handleShow = () => setShowPassword(true);
    const handleHide = () => setShowPassword(false);
    return (
        <div className="auth-div">
            <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
                <button className="back-btn"
                type="button"
                onClick={()=>navigate("/")}>
                    <IoReturnUpBack/>
                    Return to home
                </button>
                {login ? (<>
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
                            setLogin(false); console.log(login);
                        }}
                    >New User? Sign up</button>

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
                                setLogin(true); console.log(login);
                            }}
                        >Old User? Log in</button>
                    </>
                    )
                }

            </form>
        </div>
    )
}