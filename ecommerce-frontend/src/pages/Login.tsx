import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    await login(email, password);
    toast.success("Login successful");
    navigate("/");
  };

  return (
    <div className="sign-up-main-div">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="Login-max-w-md Login-w-full Login-bg-gray-800 Login-bg-opacity-50 Login-backdrop-filter Login-backdrop-blur-xl Login-rounded-2xl Login-shadow-xl Login-overflow-hidden login-container"
      >
        <div className="Login-p-8">
          <h2 className="Login-text-3xl Login-font-bold Login-mb-6 Login-text-center Login-bg-gradient-to-r Login-from-green-400 Login-to-emerald-500 Login-text-transparent Login-bg-clip-text">
            Welcome Back
          </h2>

          <form onSubmit={handleLogin}>
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="Login-flex Login-items-center Login-mb-6">
              <Link
                to="/forgot-password"
                className="Login-text-sm Login-text-green-400 Login-hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            {error && (
              <p className="red font-600">
                {error}
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="border-none Login-w-full Login-py-3 Login-px-4 Login-bg-gradient-to-r Login-from-green-500 Login-to-emerald-600 Login-text-white Login-font-bold Login-rounded-lg Login-shadow-lg Login-hover:from-green-600 Login-hover:to-emerald-700 Login-focus:outline-none Login-focus:ring-2 Login-focus:ring-green-500 Login-focus:ring-offset-2 Login-focus:ring-offset-gray-900 Login-transition Login-duration-200"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="Login-w-6 Login-h-6 Login-animate-spin  Login-mx-auto" />
              ) : (
                "Login"
              )}
            </motion.button>
          </form>
        </div>
        <div className="Login-px-8 Login-py-4 Login-bg-gray-900 Login-bg-opacity-50 Login-flex Login-justify-center">
          <p className="Login-text-sm Login-text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="Login-text-green-400 Login-hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
export default Login;
