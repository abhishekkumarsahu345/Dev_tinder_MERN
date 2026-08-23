import React, { useState } from "react";
import Container from "../Components/Container";
import Input from "../Components/Input";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser, setAuthMode } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { toast } from "react-toastify";

const Auth = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authMode } = useSelector((state) => state.user);
  function handleChange({ value, name }) {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  const handleSubmit = async () => {
    const endpoint = authMode === "login" ? "auth/login" : "auth/signup";
    const payload =
      authMode === "login"
        ? { emailId: formData.email, password: formData.password }
        : {
            firstName: formData.firstName,
            lastName: formData.lastName,
            emailId: formData.email,
            password: formData.password,
          };
    try {
      const res = await axios.post(BASE_URL + endpoint, payload, {
        withCredentials: true,
      });
      setError("");
      console.log("res data:",res.data.data);
      
      if (authMode == "login") {
        dispatch(addUser(res.data.data));
        navigate("/feed");
      } else {
        toast.success("Account created successfully. Please login.", {
          autoClose: 1500,
        });
        dispatch(setAuthMode("login"));
        setFormData({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
        });
      }
    } catch (error) {
      //setError(error.response?.data?.data || "Something went wrong");
       const errorPayload = error.response?.data;

      // Scenario 1: The backend sends the array directly in the response body
      if (Array.isArray(errorPayload)) {
        // Grab the "message" from the first error in the array
        setError(errorPayload[0].message); 
      } 
      // Scenario 2: The backend nests the array inside another "data" object
      else if (errorPayload?.data && Array.isArray(errorPayload.data)) {
        setError(errorPayload.data[0].message);
      } 
      // Scenario 3: The backend sends a simple string message
      else if (typeof errorPayload?.data === 'string') {
        setError(errorPayload.data);
      } 
      // Fallback: If all else fails or the server is down
      else {
        setError("Something went wrong");
      }
    }
  };
  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center py-10">
        {/* Signup Card */}
        <div className="w-full max-w-md rounded-2xl flex flex-col items-center p-8 space-y-6 border border-gray-700">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
            {authMode === "login"
              ? "Login to your Account"
              : "Create An Account"}
          </h2>

          {/* Inputs */}
          <div className="w-full flex flex-col gap-4">
            {authMode === "signup" && (
              <>
                <Input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onValueChange={handleChange}
                />
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onValueChange={handleChange}
                />
              </>
            )}

            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onValueChange={handleChange}
            />

            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onValueChange={handleChange}
            />

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Signup Button */}
          <button
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onClick={handleSubmit}
          >
            {authMode === "login" ? "Login" : "Create Account"}
          </button>

          {/* Footer / Login Link */}
          <p className="text-gray-400 text-sm text-center">
            {authMode === "login" ? (
              <>
                Don’t have an account?{" "}
                <span
                  className="text-indigo-400 cursor-pointer"
                  onClick={() => dispatch(setAuthMode("signup"))}
                >
                  Signup
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  className="text-indigo-400 cursor-pointer"
                  onClick={() => dispatch(setAuthMode("login"))}
                >
                  Login
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Auth;
