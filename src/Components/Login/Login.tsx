import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faFacebook,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase/Firebase";

const Login: React.FC = () => {
  const [email, setEmail] = useState(""); // Changed from username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(-1);
    } catch (err: any) {
      setError(err.message || "Failed to sign in.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#232422] relative overflow-hidden font-sans">
      <div className="absolute top-10 left-10 w-24 h-24 bg-yellow-200 rotate-45 rounded-md opacity-30 blur-2xl" />
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-gradient-to-tr from-yellow-300 to-lime-500 rounded-full blur-3xl opacity-20" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-tr from-yellow-300 to-yellow-500 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-yellow-300 rotate-45 rounded-md opacity-30 blur-2xl" />

      <div className="relative bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl p-10 w-full max-w-sm border border-white/10 z-10">
        <h1 className="text-3xl font-bold text-white text-center mb-2 tracking-wide">
          SAMP-MART
        </h1>
        <p className="text-sm text-gray-300 text-center mb-6">
          Start Shopping 🛒
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-transparent border border-gray-500 text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-transparent border border-gray-500 text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
          <div className="text-right text-xs text-lime-300 mt-1 ">
            <p>
              Don't have an account?{" "}
              <Link className="cursor-pointer hover:underline" to="/register">
                Create an account
              </Link>
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-lime-400 hover:bg-lime-300 text-gray-900 rounded-full font-semibold shadow-md transition-colors duration-200"
          >
            SIGN IN
          </button>

          <div className="flex justify-center gap-6 mt-5 text-xl text-gray-300">
            <FontAwesomeIcon
              icon={faGoogle}
              className="cursor-pointer hover:text-red-500 transition duration-300"
            />
            <FontAwesomeIcon
              icon={faFacebook}
              className="cursor-pointer hover:text-blue-500 transition duration-300"
            />
            <FontAwesomeIcon
              icon={faInstagram}
              className="cursor-pointer hover:text-pink-400 transition duration-300"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
