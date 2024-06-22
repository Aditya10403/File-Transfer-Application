import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const [alerterror, setAlertError] = useState(null);
  const [alertsuccess, setAlertSuccess] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setAlertError(data.message);
        dispatch(signInFailure(data));
        return;
      }
      setAlertError(null);
      setAlertSuccess(true);
      dispatch(signInSuccess(data));
    } catch (error) {
      setAlertError(error.message);
      dispatch(signInFailure(error));
    }
  };

  useEffect(() => {
    if (alerterror) {
      const timer = setTimeout(() => {
        setAlertError(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
    if (alertsuccess) {
      const timer = setTimeout(() => {
        setAlertSuccess(false);
        navigate("/");
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [alerterror, alertsuccess, setAlertSuccess, setAlertError]);
  return (
    <>
      {alertsuccess && (
        <div className="w-[270px] md:w-[350px] absolute md:left-[1%] md:top-[12%] flex flex-col gap-y-2">
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            Welcome to AuthGate
          </Alert>
        </div>
      )}
      {alerterror && (
        <div className="w-[270px] md:w-[350px] absolute md:left-[1%] md:top-[12%] flex flex-col gap-y-2">
          {alerterror === "User not found!" ? (
            <Alert severity="warning">
              <AlertTitle>Warning</AlertTitle>
              User not found!
            </Alert>
          ) : alerterror === "Invalid credentials!" ? (
            <Alert severity="info">
              <AlertTitle>Info</AlertTitle>
              Invalid credentials!
            </Alert>
          ) : (
            <Alert severity="warning">
              <AlertTitle>Warning</AlertTitle>
              Something went wrong!
            </Alert>
          )}
        </div>
      )}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto mt-10 lg:py-0">
        <label className="flex items-center mb-6 text-2xl font-bold text-gray-900">
          Sign In
        </label>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Log In
            </h1>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 md:space-y-6"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@company.com"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder=" • • • • • • • •"
                  // minLength={6}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                {loading ? "Logging In..." : "Log On"}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don&#39;t have an account?{" "}
                <Link
                  to="/sign-up"
                  className="font-medium text-primary-600 hover:underline"
                >
                  SignUp
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
