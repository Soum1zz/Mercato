import { useState, useRef } from "react";
import toast from "react-hot-toast";

export default function OtpInput({  setStep }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);
  const email= localStorage.getItem("email");
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move to next box
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // backspace → go to previous
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(paste)) return;

    const newOtp = paste.split("");
    setOtp(newOtp);

    newOtp.forEach((digit, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i].value = digit;
      }
    });
  };

  const verifyOtp = async () => {
    setLoading(true);
    const finalOtp = otp.join("");
    if(finalOtp.length!=6){
      toast.error("Please enter 6 digit OTP");
      setLoading(false);
      return;
    }
    if (!email) {
      toast.error("Session expired. Please enter email again.");
      setStep("email");
      return;
    }

    const res = await fetch("http://localhost:8080/api/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        email: email
        , otp: finalOtp }),
    });

    if (res.ok) {
      toast.success("Your email is verified with Mercato!!")
      setStep("signup") ;
    } else {
      toast.error("Invalid OTP");
    }
    setLoading(false);
  };

  return (
    <div className="otp-container">
      <h2>Verify your email</h2>
      <p>OTP sent to {email}</p>

      <div className="otp-box">
        {otp.map((digit, index) => (
          <input

            style={{width: "45px"}}
            key={index}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            ref={(el) => (inputsRef.current[index] = el)}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className="otp-input"
          />
        ))}
      </div>

      <button onClick={verifyOtp} className="auth-btn"
      disabled={loading}
      >
        Verify OTP
      </button>
    </div>
  );
}