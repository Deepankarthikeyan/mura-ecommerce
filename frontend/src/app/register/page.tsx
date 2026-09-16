/*
"use client"

import HeaderOne from "@/components/header/Header";
import ShortService from "@/components/service/ShortService";

import FooterOne from "@/components/Footer";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
}

export default function Home() {

  const router = useRouter()

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateUsername = (username: string): boolean => {
    return username.trim().length >= 3;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (!validateUsername(username)) {
      newErrors.username = "Username must be at least 3 characters long";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Call the registration API with action 'register'
      const response = await axios.post(`/api/users`, {
        action: 'register',
        body: {
          username: username,
          email: email,
          password: password
        }
      });

      // Check if registration was successful
      if (response.data?.success) {
        console.log('Registration successful: ', response.data);
        // Navigate to login page only on success
        router.push('/login');
      } else {
        setSubmitError(response.data?.message || "Registration failed. Please try again.");
      }

    } catch (error: any) {
      console.log('Registration error: ', error);
      // Show error message based on the error type
      if (error.response) {
        // Server responded with an error status
        const serverMessage = error.response.data?.message;
        if (error.response.status === 400) {
          setSubmitError(serverMessage || "Invalid data. Please check your inputs.");
        } else if (error.response.status === 409) {
          setSubmitError("User with this email already exists.");
        } else {
          setSubmitError(serverMessage || "Registration failed. Please try again.");
        }
      } else if (error.request) {
        // Request was made but no response received
        setSubmitError("Network error. Please check your connection and try again.");
      } else {
        // Something else happened
        setSubmitError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="demo-one">
      <HeaderOne />


      <>
        <div className="rts-navigation-area-breadcrumb bg_light-1">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="navigator-breadcrumb-wrapper">
                  <a href="index.html">Home</a>
                  <i className="fa-regular fa-chevron-right" />
                  <a className="current" href="register.html">
                    Register
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section-seperator bg_light-1">
          <div className="container">
            <hr className="section-seperator" />
          </div>
        </div>
        {/* rts register area start */
        // <div className="rts-register-area rts-section-gap bg_light-1">
        //   <div className="container">
        //     <div className="row">
        //       <div className="col-lg-12">
        //         <div className="registration-wrapper-1">
        //           <div className="logo-area mb--0">
        //             <img
        //               className="mb--10"
        //               src="assets/images/logo/logo-1.png"
        //               alt="logo"
        //             />
        //           </div>
        //           <h3 className="title">Register Into Your Account</h3>
        //           <form action="#" className="registration-form" onSubmit={handleRegister}>
        //             <div className="input-wrapper">
        //               <label htmlFor="name">Username<span style={{ color: "red" }}>*</span></label>
        //               <input
        //                 type="text"
        //                 id="name"
        //                 value={username}
        //                 onChange={(e) => {
        //                   setUsername(e.target.value);
        //                   if (errors.username) {
        //                     setErrors((prev) => ({ ...prev, username: undefined }));
        //                   }
        //                 }}
        //                 style={{
        //                   border: errors.username ? "2px solid red" : "1px solid #ccc",
        //                   transition: "border-color 0.3s ease"
        //                 }}
        //               />
        //               {errors.username && (
        //                 <span className="error-message" style={{ color: "red", fontSize: "14px", marginTop: "5px", display: "block" }}>
        //                   {errors.username}
        //                 </span>
        //               )}
        //             </div>
        //             <div className="input-wrapper">
        //               <label htmlFor="email">Email<span style={{ color: "red" }}>*</span></label>
        //               <input
        //                 type="email"
        //                 id="email"
        //                 value={email}
        //                 onChange={(e) => {
        //                   setEmail(e.target.value);
        //                   if (errors.email) {
        //                     setErrors((prev) => ({ ...prev, email: undefined }));
        //                   }
        //                 }}
        //                 style={{
        //                   border: errors.email ? "2px solid red" : "1px solid #ccc",
        //                   transition: "border-color 0.3s ease"
        //                 }}
        //               />
        //               {errors.email && (
        //                 <span className="error-message" style={{ color: "red", fontSize: "14px", marginTop: "5px", display: "block" }}>
        //                   {errors.email}
        //                 </span>
        //               )}
        //             </div>
        //             <div className="input-wrapper">
        //               <label htmlFor="password">Password<span style={{ color: "red" }}>*</span></label>
        //               <input
        //                 type="password"
        //                 id="password"
        //                 value={password}
        //                 onChange={(e) => {
        //                   setPassword(e.target.value);
        //                   if (errors.password) {
        //                     setErrors((prev) => ({ ...prev, password: undefined }));
        //                   }
        //                 }}
        //                 style={{
        //                   border: errors.password ? "2px solid red" : "1px solid #ccc",
        //                   transition: "border-color 0.3s ease"
        //                 }}
        //               />
        //               {errors.password && (
        //                 <span className="error-message" style={{ color: "red", fontSize: "14px", marginTop: "5px", display: "block" }}>
        //                   {errors.password}
        //                 </span>
        //               )}
        //             </div>
        //             {submitError && (
        //               <div
        //                 className="submit-error-message"
        //                 style={{
        //                   color: "red",
        //                   fontSize: "14px",
        //                   marginBottom: "15px",
        //                   padding: "10px",
        //                   backgroundColor: "#fee2e2",
        //                   borderRadius: "4px",
        //                   border: "1px solid #ef4444"
        //                 }}
        //               >
        //                 {submitError}
        //               </div>
        //             )}
        //             <button type="submit" className="rts-btn btn-primary" disabled={isSubmitting}>
        //               {isSubmitting ? "Registering..." : "Register Account"}
        //             </button>
        //             <div className="another-way-to-registration">
                      {/* <div className="registradion-top-text">
                        <span>Or Register With</span>
                      </div>
                      <div className="login-with-brand">
                        <a href="#" className="single">
                          <img src="assets/images/form/google.svg" alt="login" />
                        </a>
                        <a href="#" className="single">
                          <img src="assets/images/form/facebook.svg" alt="login" />
                        </a>
                      </div> */}
        //               <p>
        //                 Already Have Account? <a href="#">Login</a>
        //               </p>
        //             </div>
        //           </form>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </div>
        {/* rts register area end */}
      // </>




//       <ShortService />
//       <FooterOne />

//     </div>
//   );
// }
// */

// This page has been converted to a dialog component.
// The registration functionality is now available in @/components/auth/RegisterDialog
// and is triggered by clicking the Registration link in the Login dialog.

export default function RegisterPage() {
  return null;
}
