// import React, { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");

//   const handleSendOtp = async () => {
//     try {
//       const response = await axios.post("http://localhost:8080/api/forgot/password", { email });
//       if (response.status === 200) {
//         toast.success("OTP sent to your email.");
//         setOtpSent(true);
//       }
//     } catch (error) {
//       toast.error("Failed to send OTP. Please try again.");
//       console.error(error);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     try {
//       const response = await axios.post("http://localhost:8080/api/verify/otp", {
//         email,
//         otp,
//         newPassword
//       });
//       if (response.status === 200) {
//         toast.success("Password reset successful.");
//         setOtpSent(false);
//         setEmail("");
//         setOtp("");
//         setNewPassword("");
//       }
//     } catch (error) {
//       toast.error("Invalid OTP or password reset failed.");
//       console.error(error);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="col-md-6 mx-auto">
//         <h3 className="mb-4 text-center">Forgot Password</h3>

//         <div className="form-group mb-3">
//           <label>Email</label>
//           <input
//             type="email"
//             className="form-control"
//             placeholder="Enter your registered email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>

//         {!otpSent ? (
//           <button className="btn btn-primary w-100" onClick={handleSendOtp}>
//             Send OTP
//           </button>
//         ) : (
//           <>
//             <div className="form-group mt-3">
//               <label>Enter OTP</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//               />
//             </div>

//             <div className="form-group mt-3">
//               <label>New Password</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 placeholder="Enter new password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//               />
//             </div>

//             <button className="btn btn-success mt-3 w-100" onClick={handleVerifyOtp}>
//               Verify OTP & Reset Password
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // for navigation

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post("http://localhost:8080/api/forgot/password", { email });
      if (response.status === 200) {
        toast.success("OTP sent to your email.");
        setOtpSent(true);
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
      console.error(error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/verify/otp", {
        email,
        otp,
        newPassword
      });
      if (response.status === 200) {
        toast.success("Password reset successful.");
        setOtpSent(false);
        setEmail("");
        setOtp("");
        setNewPassword("");
        navigate("/login"); // redirect after successful reset
      }
    } catch (error) {
      toast.error("Invalid OTP or password reset failed.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-6 mx-auto">
        <h3 className="mb-4 text-center">Forgot Password</h3>

        <div className="form-group mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {!otpSent ? (
          <>
            <button className="btn btn-primary w-100" onClick={handleSendOtp} disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <button
              className="btn btn-link w-100 mt-3 text-center"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <div className="form-group mt-3">
              <label>Enter OTP</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div className="form-group mt-3">
              <label>New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button
              className="btn btn-success mt-3 w-100"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? "Processing..." : "Verify OTP & Reset Password"}
            </button>

            <button
              className="btn btn-link w-100 mt-3 text-center"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
