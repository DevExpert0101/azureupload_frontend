import React, { useState } from "react";

interface LoginSignUpProps {
  onAuthSuccess: () => void;
}

const LoginSignUp: React.FC<LoginSignUpProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [organization, setOrganization] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    organization?: string;
  }>({});

  const handleAuth = async () => {
    try {
      // Validate input values
      const newErrors: {
        email?: string;
        password?: string;
        organization?: string;
      } = {};

      if (!email) {
        newErrors.email = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Email is invalid.";
      }

      if (!password) {
        newErrors.password = "Password is required.";
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
      }

      if (isSignUp && !organization) {
        newErrors.organization = "Organization is required for sign up.";
      }

      // Update errors state
      setErrors(newErrors);

      // Display errors if any
      if (Object.keys(newErrors).length > 0) {
        console.error("Validation errors:", newErrors);
        return;
      }

      // Proceed with authentication if no errors
      const response = await fetch("http://localhost:8000/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          organization: isSignUp ? organization : null,
          isSignUp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to authenticate");
      } else if (isSignUp) {
        if (data.message === "User already exists") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "User already exists",
          }));
          return;
        }
        setIsSignUp(false); // Redirect to sign in by toggling the sign-up state
      } else {
        if (data.message === "Invalid email") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "This email is not registered",
          }));
          return;
        } else if (data.message === "Password is incorrect") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: "Password is incorrect",
          }));
          return;
        }
      }

      if (data.success) {
        localStorage.setItem("authToken", data.token);
        if (!isSignUp) {
          // Store organization in localStorage if signing in
          localStorage.setItem("organization", data.organization || "");
        }
        onAuthSuccess();
      } else {
        console.error("Authentication failed:", data.message);
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  return (
    <div className="login-signup-container flex flex-col justify-center">
      <h2 className="text-2xl font-bold mb-4">
        {isSignUp ? "Sign Up" : "Sign In"}
      </h2>
      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
          {/* <span
            className="absolute right-2 top-2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          > */}
          {!showPassword ? (
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[2px] bottom-[2px] flex justify-center items-center px-1 rounded end-px"
            >
              <svg
                viewBox="0 0 24 24"
                width="16px"
                height="16px"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="svg-icon mx-2 cursor-pointer"
                data-component-name="Icon-C"
                data-name="Hero--HeroEye"
              >
                <path
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </div>
          ) : (
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[2px] bottom-[2px] flex justify-center items-center px-1 rounded end-px"
            >
              <svg
                viewBox="0 0 24 24"
                width="16px"
                height="16px"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="svg-icon mx-2 cursor-pointer"
                data-component-name="Icon-C"
                data-name="Hero--HeroEyeSlash"
              >
                <path
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </div>
          )}
          {/* </span> */}
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>
      {isSignUp && (
        <div className="mb-4">
          <label className="block text-gray-700">Organization</label>
          <input
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
          {errors.organization && (
            <p className="text-red-500 text-sm mt-1">{errors.organization}</p>
          )}
        </div>
      )}
      <button
        onClick={handleAuth}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700 transition duration-200"
      >
        {isSignUp ? "Sign Up" : "Sign In"}
      </button>
      <div className="flex-1 flex-row justify-center my-2">
        {/* <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-500 mt-4 hover:underline"
        > */}
        {isSignUp ? (
          <span className="text-blue-200 flex items-center gap-2">
            Already have an account?
            <p
              className="text-blue-500 ml-2 cursor-pointer"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              Sign In
            </p>
          </span>
        ) : (
          <span className="text-blue-200 flex items-center gap-2">
            Don’t have an account?
            <p
              className="text-blue-500 ml-2 cursor-pointer"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {" "}
              Sign Up
            </p>
          </span>
        )}
        {/* </button> */}
      </div>
    </div>
  );
};

export default LoginSignUp;
