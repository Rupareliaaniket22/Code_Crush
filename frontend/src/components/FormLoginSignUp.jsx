import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";

const FormLoginSignUp = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleFormSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      const endpoint = isSignUp ? "/signup" : "/login";
      const payload = isSignUp
        ? { emailId, password, firstName, lastName }
        : { emailId, password };

      const res = await axios.post(BASE_URL + endpoint, payload, {
        withCredentials: true,
      });

      if (res.data) {
        dispatch(addUser(res.data));
        if (isSignUp) navigate("/profile");
        else navigate("/feed");
      }
    } catch (err) {
      setError(err.response?.data || "Something went wrong.");
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-base-200 to-base-300 flex sm:items-center sm:justify-center sm:px-4 w-screen">
      <div className="sm:pt-20 pt-24 w-screen sm:max-w-md bg-base-100 rounded-xl shadow-md border border-base-300 sm:p-8 p-4 space-y-2 sm:space-y-4">
        <div className="sm:flex hidden  justify-center">
          <img
            src="logo.png"
            alt="CodeCrush Logo"
            className="w-14 h-14 sm:w-20 sm:h-20"
          />
        </div>
        <h2 className="text-center sm:text-2xl text-xl font-bold text-primary">
          {isSignUp ? "Create Account 🚀" : "Welcome Back 👋"}
        </h2>
        <p className="text-center text-xs sm:text-sm text-base-content/70">
          {isSignUp
            ? "Join CodeCrush to find your perfect coding partner!"
            : "Sign in to discover your perfect coding match."}
        </p>

        <form className="space-y-4 px-3 sm:px-0" onSubmit={handleFormSubmit}>
          {isSignUp && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="label">
                  <span className="label-text text-base-content py-1">
                    First Name
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="John"
                  className="input input-bordered w-full bg-base-200"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-base-content py-1">
                    Last Name
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="input input-bordered w-full bg-base-200"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="label">
              <span className="label-text text-base-content py-1">Email</span>
            </label>
            <input
              type="email"
              placeholder="codeCrush@gmail.com"
              className="input input-bordered w-full bg-base-200"
              value={emailId}
              autoComplete="username"
              onChange={(e) => setEmailId(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text text-base-content py-1">
                Password
              </span>
            </label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="••••••••"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              className="input input-bordered w-full bg-base-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {isSignUp && (
              <div className="flex justify-between mt-2  items-center">
                <label className="cursor-pointer label">
                  <input
                    type="checkbox"
                    className="checkbox w-4  h-4"
                    onChange={() => setIsPasswordVisible(!isPasswordVisible)}
                  />
                  <span className="label-text text-sm">Show Password</span>
                </label>
              </div>
            )}
          </div>

          {!isSignUp && (
            <div className="flex justify-between items-center">
              <label className="cursor-pointer label">
                <input
                  type="checkbox"
                  className="checkbox w-4 h-4"
                  onChange={() => setIsPasswordVisible(!isPasswordVisible)}
                />
                <span className="label-text text-sm">Show Password</span>
              </label>
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center whitespace-pre-wrap">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full hover:brightness-110 transition-all"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-sm text-base-content/70">
            {isSignUp ? "Already have an account?" : "New here?"}{" "}
            <button
              className="text-primary hover:underline"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
            >
              {isSignUp ? "Sign In" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormLoginSignUp;
