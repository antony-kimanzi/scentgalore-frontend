import React, { useEffect, useState, useCallback } from "react";
import "../../styles/SignUp.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useGoogleLogin } from "../../hooks/useGoogleLogin";

export default function SignUp() {
  const isMobile: boolean = window.innerWidth <= 800;
  const { register, isLoading, error, user } = useAuth();
  const [show, setShow] = useState<boolean>(false);
  const [inputType, setInputType] = useState<string>("password");
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { isScriptLoaded, renderGoogleButton } = useGoogleLogin({
    mode: "signup", // Changed to signup
    onSuccess: (userData) => {
      console.log("Sign up successful:", userData);
      // Google sign up will automatically redirect on success
    },
    onError: (error) => {
      console.error("Sign up error:", error);
    },
  });

  const navigate = useNavigate();

  // Render Google button when script loads
  useEffect(() => {
    if (isScriptLoaded) {
      renderGoogleButton("google-signup-button", "signup_with");
    }
  }, [isScriptLoaded, renderGoogleButton]);

  const handleInputChange = useCallback(
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    },
    []
  );

  const togglePasswordVisibility = () => {
    setShow(!show);
  };

  const handleSignUpBtn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userData.password !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    try {
      await register(userData);
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  // const handleGoogleSignUp = () => {
  //   if (!isScriptLoaded) {
  //     alert("Google Sign-In is loading. Please wait.");
  //     return;
  //   }

  //   if (window.google?.accounts?.id) {
  //     // Simple approach: just trigger the prompt
  //     window.google.accounts.id.prompt();
  //   }
  // };

  useEffect(() => {
    setInputType(show ? "text" : "password");
  }, [show]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div>
      {isMobile ? (
        <div className="signup-page-mobile">
          <div className="signup-container-mobile">
            {error && <p className="error-massage-mobile">{error}</p>}
            <Link to={"/"}>
              <img
                src="https://res.cloudinary.com/dhnyfifkc/image/upload/nav-logo_ozc4bw.png"
                alt="Scent Galore Logo"
                className="logo-mobile"
              />
            </Link>

            <h1 className="signup-title-mobile">Sign Up</h1>
            <p className="signup-text-mobile">Welcome to ScentGalore</p>
            {passwordMatch === false && <span>Password must match</span>}
            <form className="signup-form-mobile" onSubmit={handleSignUpBtn}>
              <div className="name-container-mobile">
                <div className="name-mobile">
                  <label className="signup-label-mobile">First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="name-input-mobile"
                    value={userData.firstName}
                    onChange={handleInputChange("firstName")}
                    required
                  />
                </div>
                <div className="name-mobile">
                  <label className="signup-label-mobile">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="name-input-mobile"
                    value={userData.lastName}
                    onChange={handleInputChange("lastName")}
                    required
                  />
                </div>
              </div>
              <label className="signup-label-mobile">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="email-input-mobile"
                value={userData.email}
                onChange={handleInputChange("email")}
                required
              />
              <label className="signup-label-mobile">Set Password</label>
              <div className="password-container-mobile">
                <input
                  type={inputType}
                  placeholder="Password"
                  className="password-input-mobile"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                  required
                />
                {show ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="-0.855 -0.855 24 24"
                    id="Invisible-2--Streamline-Core"
                    height="24"
                    width="24"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    <desc>
                      Invisible 2 Streamline Icon: https://streamlinehq.com
                    </desc>
                    <g id="invisible-2">
                      <path
                        id="Ellipse 54"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.6739084 6.697030499999999c1.5495052714285713 2.8796610214285714 4.761207685714285 4.857962207142857 8.471935435714284 4.857962207142857S18.068274 9.576691521428572 19.617747428571427 6.697030499999999"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 1140"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.376896242857143 8.909933935714285 0.7960714285714285 11.910916242857143"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 1142"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.62312532142857 11.25055907142857 6.898930135714285 15.592842128571428"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 1143"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.91304007142857 8.909933935714285 21.49392857142857 11.910916242857143"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 1144"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m13.66085637857143 11.25055907142857 1.7241951857142856 4.342283057142858"
                        strokeWidth="1.71"
                      ></path>
                    </g>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="-0.855 -0.855 24 24"
                    id="Eye-Optic--Streamline-Core"
                    height="24"
                    width="24"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    <desc>
                      Eye Optic Streamline Icon: https://streamlinehq.com
                    </desc>
                    <g id="eye-optic--health-medical-eye-optic">
                      <path
                        id="Vector 2095"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.144824864285713 5.253657471428571c-6.781891714285714 0 -9.62925771 7.199510785714285 -9.62925771 7.324064121428571C1.515567154285714 12.702290849999999 4.36293315 19.901785714285715 11.144824864285713 19.901785714285715c6.781907635714286 0 9.62929592142857 -7.199494864285714 9.62929592142857 -7.324064121428571 0 -0.1245533357142857 -2.8473882857142856 -7.324064121428571 -9.62929592142857 -7.324064121428571"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 2096"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.660495642857143 9.008535342857144 0.7960714285714285 6.232045178571428"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 2097"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.158745014285715 5.751297642857143 7.095066214285714 2.3882142857142856"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 2099"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18.67392514285714 9.058353492857142 21.49392857142857 6.232045178571428"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 2100"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.1376554 5.751313564285714 15.195013392857142 2.3882142857142856"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Ellipse 1919"
                        stroke="#000000"
                        d="M8.371487142857143 12.577928571428572a2.773512857142857 2.773512857142857 0 1 0 5.547025714285714 0 2.773512857142857 2.773512857142857 0 1 0 -5.547025714285714 0"
                        strokeWidth="1.71"
                      ></path>
                    </g>
                  </svg>
                )}
              </div>

              <label
                className={
                  passwordMatch === false
                    ? "error-label-mobile"
                    : "signup-label-mobile"
                }
              >
                Confirm Password
              </label>
              <div className="password-container-mobile">
                <input
                  type={inputType}
                  placeholder="Password"
                  className={
                    passwordMatch === false
                      ? "error-input-mobile"
                      : "password-input-mobile"
                  }
                  value={userData.password}
                  onChange={handleInputChange("password")}
                  required
                />
                {show ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="-0.855 -0.855 24 24"
                    id="Invisible-2--Streamline-Core"
                    height="24"
                    width="24"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    <desc>
                      Invisible 2 Streamline Icon: https://streamlinehq.com
                    </desc>
                    <g id="invisible-2">
                      <path
                        id="Ellipse 54"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.6739084 6.697030499999999c1.5495052714285713 2.8796610214285714 4.761207685714285 4.857962207142857 8.471935435714284 4.857962207142857S18.068274 9.576691521428572 19.617747428571427 6.697030499999999"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 1140"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.376896242857143 8.909933935714285 0.7960714285714285 11.910916242857143"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 1142"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.62312532142857 11.25055907142857 6.898930135714285 15.592842128571428"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 1143"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.91304007142857 8.909933935714285 21.49392857142857 11.910916242857143"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 1144"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m13.66085637857143 11.25055907142857 1.7241951857142856 4.342283057142858"
                        strokeWidth="1.71"
                      ></path>
                    </g>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="-0.855 -0.855 24 24"
                    id="Eye-Optic--Streamline-Core"
                    height="24"
                    width="24"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    <desc>
                      Eye Optic Streamline Icon: https://streamlinehq.com
                    </desc>
                    <g id="eye-optic--health-medical-eye-optic">
                      <path
                        id="Vector 2095"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.144824864285713 5.253657471428571c-6.781891714285714 0 -9.62925771 7.199510785714285 -9.62925771 7.324064121428571C1.515567154285714 12.702290849999999 4.36293315 19.901785714285715 11.144824864285713 19.901785714285715c6.781907635714286 0 9.62929592142857 -7.199494864285714 9.62929592142857 -7.324064121428571 0 -0.1245533357142857 -2.8473882857142856 -7.324064121428571 -9.62929592142857 -7.324064121428571"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 2096"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.660495642857143 9.008535342857144 0.7960714285714285 6.232045178571428"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 2097"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.158745014285715 5.751297642857143 7.095066214285714 2.3882142857142856"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 2099"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18.67392514285714 9.058353492857142 21.49392857142857 6.232045178571428"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 2100"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.1376554 5.751313564285714 15.195013392857142 2.3882142857142856"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Ellipse 1919"
                        stroke="#000000"
                        d="M8.371487142857143 12.577928571428572a2.773512857142857 2.773512857142857 0 1 0 5.547025714285714 0 2.773512857142857 2.773512857142857 0 1 0 -5.547025714285714 0"
                        strokeWidth="1.71"
                      ></path>
                    </g>
                  </svg>
                )}
              </div>
              {!isLoading && (
                <button type="submit" className="signup-button-mobile">
                  Sign Up
                </button>
              )}
            </form>
            {isLoading ? (
              <div className="loading">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              <>
                <div className="google-signup-mobile">
                  <p>or sign up with</p>
                  {/* Google Sign Up button container */}
                  <div
                    id="google-signup-button"
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "10px",
                      minHeight: "44px",
                    }}
                  ></div>
                </div>
                <div className="signup-footer-mobile">
                  <p className="link-section">
                    Don't have an account?{" "}
                    <Link to={"/signin"} className="link-mobile">
                      Sign In here
                    </Link>
                  </p>
                  <p className="link-section">
                    <Link to={"/shop"} className="link-mobile">
                      <svg
                        viewBox="0 0 16 16"
                        fill="#000000"
                        xmlns="http://www.w3.org/2000/svg"
                        id="Reply-Fill--Streamline-Remix-Fill"
                        height="16"
                        width="16"
                      >
                        <desc>
                          Reply Fill Streamline Icon: https://streamlinehq.com
                        </desc>
                        <path
                          d="M7.333333333333333 13.333333333333332 0.6666666666666666 8l6.666666666666666 -5.333333333333333v3.333333333333333c3.6818666666666666 0 6.666666666666666 2.9848 6.666666666666666 6.666666666666666 0 0.1819333333333333 -0.007266666666666666 0.36219999999999997 -0.021599999999999998 0.5404666666666667C12.973666666666666 11.300133333333331 10.971999999999998 10 8.666666666666666 10h-1.3333333333333333v3.333333333333333Z"
                          strokeWidth="0.6667"
                        ></path>
                      </svg>{" "}
                      Continue shopping
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="signup-footer-text-mobile">
            <p>&copy; 2025 Scent Galore. All rights reserved.</p>
          </div>
        </div>
      ) : (
        <div className="signup-page">
          <div className="signup-container">
            {error && <p className="error-massage">{error}</p>}
            <Link to={"/"}>
              <img
                src="https://res.cloudinary.com/dhnyfifkc/image/upload/nav-logo_ozc4bw.png"
                alt="Scent Galore Logo"
                className="logo"
              />
            </Link>

            <h1 className="signup-title">Sign Up</h1>
            <p className="signup-text">Welcome to ScentGalore</p>
            {passwordMatch === false && <span>Password must match</span>}
            <form className="signup-form" onSubmit={handleSignUpBtn}>
              <div className="name-container">
                <div className="name">
                  <label className="signup-label">First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="name-input"
                    value={userData.firstName}
                    onChange={handleInputChange("firstName")}
                    required
                  />
                </div>
                <div className="name">
                  <label className="signup-label">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="name-input"
                    value={userData.lastName}
                    onChange={handleInputChange("lastName")}
                    required
                  />
                </div>
              </div>
              <label className="signup-label">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="email-input"
                value={userData.email}
                onChange={handleInputChange("email")}
                required
              />
              <label className="signup-label">Set Password</label>
              <div className="password-container">
                <input
                  type={inputType}
                  placeholder="Password"
                  className="password-input"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                  required
                />
                {show ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="-0.855 -0.855 24 24"
                    id="Invisible-2--Streamline-Core"
                    height="24"
                    width="24"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    <desc>
                      Invisible 2 Streamline Icon: https://streamlinehq.com
                    </desc>
                    <g id="invisible-2">
                      <path
                        id="Ellipse 54"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.6739084 6.697030499999999c1.5495052714285713 2.8796610214285714 4.761207685714285 4.857962207142857 8.471935435714284 4.857962207142857S18.068274 9.576691521428572 19.617747428571427 6.697030499999999"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 1140"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.376896242857143 8.909933935714285 0.7960714285714285 11.910916242857143"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 1142"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.62312532142857 11.25055907142857 6.898930135714285 15.592842128571428"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 1143"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.91304007142857 8.909933935714285 21.49392857142857 11.910916242857143"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 1144"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m13.66085637857143 11.25055907142857 1.7241951857142856 4.342283057142858"
                        strokeWidth="1.71"
                      ></path>
                    </g>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="-0.855 -0.855 24 24"
                    id="Eye-Optic--Streamline-Core"
                    height="24"
                    width="24"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    <desc>
                      Eye Optic Streamline Icon: https://streamlinehq.com
                    </desc>
                    <g id="eye-optic--health-medical-eye-optic">
                      <path
                        id="Vector 2095"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.144824864285713 5.253657471428571c-6.781891714285714 0 -9.62925771 7.199510785714285 -9.62925771 7.324064121428571C1.515567154285714 12.702290849999999 4.36293315 19.901785714285715 11.144824864285713 19.901785714285715c6.781907635714286 0 9.62929592142857 -7.199494864285714 9.62929592142857 -7.324064121428571 0 -0.1245533357142857 -2.8473882857142856 -7.324064121428571 -9.62929592142857 -7.324064121428571"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 2096"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.660495642857143 9.008535342857144 0.7960714285714285 6.232045178571428"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 2097"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.158745014285715 5.751297642857143 7.095066214285714 2.3882142857142856"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 2099"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18.67392514285714 9.058353492857142 21.49392857142857 6.232045178571428"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 2100"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.1376554 5.751313564285714 15.195013392857142 2.3882142857142856"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Ellipse 1919"
                        stroke="#000000"
                        d="M8.371487142857143 12.577928571428572a2.773512857142857 2.773512857142857 0 1 0 5.547025714285714 0 2.773512857142857 2.773512857142857 0 1 0 -5.547025714285714 0"
                        strokeWidth="1.71"
                      ></path>
                    </g>
                  </svg>
                )}
              </div>

              <label
                className={
                  passwordMatch === false ? "error-label" : "signup-label"
                }
              >
                Confirm Password
              </label>
              <div className="password-container">
                <input
                  type={inputType}
                  placeholder="Password"
                  className={
                    passwordMatch === false ? "error-input" : "password-input"
                  }
                  value={userData.password}
                  onChange={handleInputChange("password")}
                  required
                />
                {show ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="-0.855 -0.855 24 24"
                    id="Invisible-2--Streamline-Core"
                    height="24"
                    width="24"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    <desc>
                      Invisible 2 Streamline Icon: https://streamlinehq.com
                    </desc>
                    <g id="invisible-2">
                      <path
                        id="Ellipse 54"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.6739084 6.697030499999999c1.5495052714285713 2.8796610214285714 4.761207685714285 4.857962207142857 8.471935435714284 4.857962207142857S18.068274 9.576691521428572 19.617747428571427 6.697030499999999"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 1140"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.376896242857143 8.909933935714285 0.7960714285714285 11.910916242857143"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 1142"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.62312532142857 11.25055907142857 6.898930135714285 15.592842128571428"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 1143"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.91304007142857 8.909933935714285 21.49392857142857 11.910916242857143"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 1144"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m13.66085637857143 11.25055907142857 1.7241951857142856 4.342283057142858"
                        strokeWidth="1.71"
                      ></path>
                    </g>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="-0.855 -0.855 24 24"
                    id="Eye-Optic--Streamline-Core"
                    height="24"
                    width="24"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    <desc>
                      Eye Optic Streamline Icon: https://streamlinehq.com
                    </desc>
                    <g id="eye-optic--health-medical-eye-optic">
                      <path
                        id="Vector 2095"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.144824864285713 5.253657471428571c-6.781891714285714 0 -9.62925771 7.199510785714285 -9.62925771 7.324064121428571C1.515567154285714 12.702290849999999 4.36293315 19.901785714285715 11.144824864285713 19.901785714285715c6.781907635714286 0 9.62929592142857 -7.199494864285714 9.62929592142857 -7.324064121428571 0 -0.1245533357142857 -2.8473882857142856 -7.324064121428571 -9.62929592142857 -7.324064121428571"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 2096"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.660495642857143 9.008535342857144 0.7960714285714285 6.232045178571428"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 2097"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.158745014285715 5.751297642857143 7.095066214285714 2.3882142857142856"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 2099"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18.67392514285714 9.058353492857142 21.49392857142857 6.232045178571428"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Vector 2100"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.1376554 5.751313564285714 15.195013392857142 2.3882142857142856"
                        strokeWidth="1.71"
                      ></path>
                      <path
                        id="Ellipse 1919"
                        stroke="#000000"
                        d="M8.371487142857143 12.577928571428572a2.773512857142857 2.773512857142857 0 1 0 5.547025714285714 0 2.773512857142857 2.773512857142857 0 1 0 -5.547025714285714 0"
                        strokeWidth="1.71"
                      ></path>
                    </g>
                  </svg>
                )}
              </div>
              {!isLoading && (
                <button type="submit" className="signup-button">
                  Sign Up
                </button>
              )}
            </form>
            {isLoading ? (
              <div className="loading">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              <>
                <div className="google-signup">
                  <p>or sign up with</p>
                  {/* Google Sign Up button container */}
                  <div
                    id="google-signup-button"
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "10px",
                      minHeight: "44px",
                    }}
                  ></div>
                </div>
                <p className="signup-footer">
                  Don't have an account?{" "}
                  <Link to={"/signin"} className="link">
                    Sign In here
                  </Link>
                </p>
                <p className="signup-footer">
                  <Link to={"/shop"} className="link">
                    <svg
                      viewBox="0 0 16 16"
                      fill="#000000"
                      xmlns="http://www.w3.org/2000/svg"
                      id="Reply-Fill--Streamline-Remix-Fill"
                      height="16"
                      width="16"
                    >
                      <desc>
                        Reply Fill Streamline Icon: https://streamlinehq.com
                      </desc>
                      <path
                        d="M7.333333333333333 13.333333333333332 0.6666666666666666 8l6.666666666666666 -5.333333333333333v3.333333333333333c3.6818666666666666 0 6.666666666666666 2.9848 6.666666666666666 6.666666666666666 0 0.1819333333333333 -0.007266666666666666 0.36219999999999997 -0.021599999999999998 0.5404666666666667C12.973666666666666 11.300133333333331 10.971999999999998 10 8.666666666666666 10h-1.3333333333333333v3.333333333333333Z"
                        strokeWidth="0.6667"
                      ></path>
                    </svg>{" "}
                    Continue shopping
                  </Link>
                </p>
              </>
            )}
          </div>
          <div className="signup-footer-text">
            <p>&copy; 2025 Scent Galore. All rights reserved.</p>
          </div>
        </div>
      )}
    </div>
  );
}
