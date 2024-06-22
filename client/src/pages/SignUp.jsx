import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // can also use axios here
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data.message);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      setSuccess(true);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        navigate("/sign-in");
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [error, success, setSuccess, setError]);

  return (
    <>
      {success && (
        <div className="w-[270px] md:w-[350px] absolute md:left-[1%] md:top-[12%] flex flex-col gap-y-2">
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            User Registered successfully!
          </Alert>
        </div>
      )}
      {error && (
        <div className="w-[270px] md:w-[350px] absolute md:left-[1%] md:top-[12%] flex flex-col gap-y-2">
          {error[62] === "u" ? (
            <Alert severity="info">
              <AlertTitle>Info</AlertTitle>
              User already exists!
            </Alert>
          ) : error[62] === "e" ? (
            <Alert severity="info">
              <AlertTitle>Info</AlertTitle>
              Email already exists!
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
          Sign Up
        </label>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Register
            </h1>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 md:space-y-6"
              action="#"
            >
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  User Name
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  // minLength={6}
                  placeholder=""
                  onChange={handleChange}
                  required
                />
              </div>
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  // minLength={6}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                {loading ? "Loading..." : "Create an account"}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/sign-in"
                  className="font-medium text-primary-600 hover:underline"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
