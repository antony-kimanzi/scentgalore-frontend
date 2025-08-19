import React from "react";
import "../styles/SignUp.scss";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [show, setShow] = React.useState<boolean>(false);
  const [inputType, setInputType] = React.useState<string>("password");

  React.useEffect(() => {
    setInputType(show ? "text" : "password");
  }, [show]);

  const togglePasswordVisibility = () => {
    setShow(!show);
  };
  return (
    <div>
      <div className="signup-container">
        <img src="/nav-logo.png" alt="Scent Galore Logo" className="logo" />
        <h1 className="signup-title">Sign Up</h1>
        <p className="signup-text">Welcome to ScentGalore</p>
        <form className="signup-form">
          <div className="name-container">
            <div className="name">
              <label className="signup-label">First Name</label>
              <input
                type="text"
                placeholder="First Name"
                className="name-input"
                required
              />
            </div>
            <div className="name"><label className="signup-label">Last Name</label>
            <input
              type="text"
              placeholder="Last Name"
              className="name-input"
              required
            /></div>
            
          </div>
          <label className="signup-label">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="email-input"
            required
          />
          <label className="signup-label">Set Password</label>
          <div className="password-container">
            <input
              type={inputType}
              placeholder="Password"
              className="password-input"
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
              >
                <desc>
                  Invisible 2 Streamline Icon: https://streamlinehq.com
                </desc>
                <g id="invisible-2">
                  <path
                    id="Ellipse 54"
                    stroke="#000000"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.6739084 6.697030499999999c1.5495052714285713 2.8796610214285714 4.761207685714285 4.857962207142857 8.471935435714284 4.857962207142857S18.068274 9.576691521428572 19.617747428571427 6.697030499999999"
                    stroke-width="1.71"
                  ></path>
                  <path
                    id="Vector 1140"
                    stroke="#000000"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.376896242857143 8.909933935714285 0.7960714285714285 11.910916242857143"
                    stroke-width="1.71"
                  ></path>
                  <path
                    id="Vector 1142"
                    stroke="#000000"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.62312532142857 11.25055907142857 6.898930135714285 15.592842128571428"
                    stroke-width="1.71"
                  ></path>
                  <path
                    id="Vector 1143"
                    stroke="#000000"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.91304007142857 8.909933935714285 21.49392857142857 11.910916242857143"
                    stroke-width="1.71"
                  ></path>
                  <path
                    id="Vector 1144"
                    stroke="#000000"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m13.66085637857143 11.25055907142857 1.7241951857142856 4.342283057142858"
                    stroke-width="1.71"
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
              >
                <desc>Eye Optic Streamline Icon: https://streamlinehq.com</desc>
                <g id="eye-optic--health-medical-eye-optic">
                  <path
                    id="Vector 2095"
                    stroke="#000000"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11.144824864285713 5.253657471428571c-6.781891714285714 0 -9.62925771 7.199510785714285 -9.62925771 7.324064121428571C1.515567154285714 12.702290849999999 4.36293315 19.901785714285715 11.144824864285713 19.901785714285715c6.781907635714286 0 9.62929592142857 -7.199494864285714 9.62929592142857 -7.324064121428571 0 -0.1245533357142857 -2.8473882857142856 -7.324064121428571 -9.62929592142857 -7.324064121428571"
                    stroke-width="1.71"
                  ></path>
                  <path
                    id="Vector 2096"
                    stroke="#000000"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.660495642857143 9.008535342857144 0.7960714285714285 6.232045178571428"
                    stroke-width="1.71"
                  ></path>
                  <path
                    id="Vector 2097"
                    stroke="#000000"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.158745014285715 5.751297642857143 7.095066214285714 2.3882142857142856"
                    stroke-width="1.71"
                  ></path>
                  <path
                    id="Vector 2099"
                    stroke="#000000"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M18.67392514285714 9.058353492857142 21.49392857142857 6.232045178571428"
                    stroke-width="1.71"
                  ></path>
                  <path
                    id="Vector 2100"
                    stroke="#000000"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.1376554 5.751313564285714 15.195013392857142 2.3882142857142856"
                    stroke-width="1.71"
                  ></path>
                  <path
                    id="Ellipse 1919"
                    stroke="#000000"
                    d="M8.371487142857143 12.577928571428572a2.773512857142857 2.773512857142857 0 1 0 5.547025714285714 0 2.773512857142857 2.773512857142857 0 1 0 -5.547025714285714 0"
                    stroke-width="1.71"
                  ></path>
                </g>
              </svg>
            )}
          </div>
          <label className="signup-label">Confirm Password</label>
          <div className="password-container">
            <input
              type={inputType}
              placeholder="Password"
              className="password-input"
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
              >
                <desc>
                  Invisible 2 Streamline Icon: https://streamlinehq.com
                </desc>
                <g id="invisible-2">
                  <path
                    id="Ellipse 54"
                    stroke="#000000"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.6739084 6.697030499999999c1.5495052714285713 2.8796610214285714 4.761207685714285 4.857962207142857 8.471935435714284 4.857962207142857S18.068274 9.576691521428572 19.617747428571427 6.697030499999999"
                    stroke-width="1.71"
                  ></path>
                  <path
                    id="Vector 1140"
                    stroke="#000000"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.376896242857143 8.909933935714285 0.7960714285714285 11.910916242857143"
                    stroke-width="1.71"
                  ></path>
                  <path
                    id="Vector 1142"
                    stroke="#000000"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.62312532142857 11.25055907142857 6.898930135714285 15.592842128571428"
                    stroke-width="1.71"
                  ></path>
                  <path
                    id="Vector 1143"
                    stroke="#000000"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.91304007142857 8.909933935714285 21.49392857142857 11.910916242857143"
                    stroke-width="1.71"
                  ></path>
                  <path
                    id="Vector 1144"
                    stroke="#000000"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m13.66085637857143 11.25055907142857 1.7241951857142856 4.342283057142858"
                    stroke-width="1.71"
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
              >
                <desc>Eye Optic Streamline Icon: https://streamlinehq.com</desc>
                <g id="eye-optic--health-medical-eye-optic">
                  <path
                    id="Vector 2095"
                    stroke="#000000"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11.144824864285713 5.253657471428571c-6.781891714285714 0 -9.62925771 7.199510785714285 -9.62925771 7.324064121428571C1.515567154285714 12.702290849999999 4.36293315 19.901785714285715 11.144824864285713 19.901785714285715c6.781907635714286 0 9.62929592142857 -7.199494864285714 9.62929592142857 -7.324064121428571 0 -0.1245533357142857 -2.8473882857142856 -7.324064121428571 -9.62929592142857 -7.324064121428571"
                    stroke-width="1.71"
                  ></path>
                  <path
                    id="Vector 2096"
                    stroke="#000000"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.660495642857143 9.008535342857144 0.7960714285714285 6.232045178571428"
                    stroke-width="1.71"
                  ></path>
                  <path
                    id="Vector 2097"
                    stroke="#000000"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.158745014285715 5.751297642857143 7.095066214285714 2.3882142857142856"
                    stroke-width="1.71"
                  ></path>
                  <path
                    id="Vector 2099"
                    stroke="#000000"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M18.67392514285714 9.058353492857142 21.49392857142857 6.232045178571428"
                    stroke-width="1.71"
                  ></path>
                  <path
                    id="Vector 2100"
                    stroke="#000000"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.1376554 5.751313564285714 15.195013392857142 2.3882142857142856"
                    stroke-width="1.71"
                  ></path>
                  <path
                    id="Ellipse 1919"
                    stroke="#000000"
                    d="M8.371487142857143 12.577928571428572a2.773512857142857 2.773512857142857 0 1 0 5.547025714285714 0 2.773512857142857 2.773512857142857 0 1 0 -5.547025714285714 0"
                    stroke-width="1.71"
                  ></path>
                </g>
              </svg>
            )}
          </div>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <div className="google-signup">
          <p>or sign up with</p>
          <button>
            <img src="/google.svg" alt="google icon" /> Sign up with Google
          </button>
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
              <desc>Reply Fill Streamline Icon: https://streamlinehq.com</desc>
              <path
                d="M7.333333333333333 13.333333333333332 0.6666666666666666 8l6.666666666666666 -5.333333333333333v3.333333333333333c3.6818666666666666 0 6.666666666666666 2.9848 6.666666666666666 6.666666666666666 0 0.1819333333333333 -0.007266666666666666 0.36219999999999997 -0.021599999999999998 0.5404666666666667C12.973666666666666 11.300133333333331 10.971999999999998 10 8.666666666666666 10h-1.3333333333333333v3.333333333333333Z"
                stroke-width="0.6667"
              ></path>
            </svg>{" "}
            Continue shopping
          </Link>
        </p>
      </div>
      <div className="signup-footer-text">
        <p>&copy; 2025 Scent Galore. All rights reserved.</p>
      </div>
    </div>
  );
}
