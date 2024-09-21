import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import Input from "../components/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await forgotPassword(email);
    setIsSubmitted(true);
  };

  return (
    <div className="sign-up-main-div">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="forgot-password-container ForgotPassword-max-w-md ForgotPassword-w-full ForgotPassword-bg-gray-800 ForgotPassword-bg-opacity-50 ForgotPassword-backdrop-filter ForgotPassword-backdrop-blur-xl ForgotPassword-rounded-2xl ForgotPassword-shadow-xl ForgotPassword-overflow-hidden"
      >
        <div className="ForgotPassword-p-8">
          <h2 className="ForgotPassword-text-3xl ForgotPassword-font-bold ForgotPassword-mb-6 ForgotPassword-text-center ForgotPassword-bg-gradient-to-r ForgotPassword-from-green-400 ForgotPassword-to-emerald-500 ForgotPassword-text-transparent ForgotPassword-bg-clip-text">
            Forgot Password
          </h2>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <p className="ForgotPassword-text-gray-300 ForgotPassword-mb-6 ForgotPassword-text-center">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="border-none ForgotPassword-w-full ForgotPassword-py-3 ForgotPassword-px-4 ForgotPassword-bg-gradient-to-r ForgotPassword-from-green-500 ForgotPassword-to-emerald-600 ForgotPassword-text-white ForgotPassword-font-bold ForgotPassword-rounded-lg ForgotPassword-shadow-lg ForgotPassword-hover:from-green-600 ForgotPassword-hover:to-emerald-700 ForgotPassword-focus:outline-none ForgotPassword-focus:ring-2 ForgotPassword-focus:ring-green-500 ForgotPassword-focus:ring-offset-2 ForgotPassword-focus:ring-offset-gray-900 ForgotPassword-transition ForgotPassword-duration-200"
                type="submit"
              >
                {isLoading ? <Loader className='ForgotPassword-size-6 ForgotPassword-animate-spin ForgotPassword-mx-auto' /> : "Send Reset Link"}
              </motion.button>
            </form>
          ) : (
            <div className="ForgotPassword-text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="ForgotPassword-w-16 ForgotPassword-h-16 ForgotPassword-bg-green-500 ForgotPassword-rounded-full ForgotPassword-flex ForgotPassword-items-center ForgotPassword-justify-center ForgotPassword-mx-auto ForgotPassword-mb-4 rounded-full"
              >
                <Mail />
              </motion.div>
              <p className="ForgotPassword-text-gray-300 ForgotPassword-mb-6">
                If an account exists for {email}, you will receive a password
                reset link shortly.
              </p>
            </div>
          )}
        </div>

        <div className="ForgotPassword-px-8 ForgotPassword-py-4 ForgotPassword-bg-gray-900 ForgotPassword-bg-opacity-50 ForgotPassword-flex ForgotPassword-justify-center">
          <Link
            to={"/login"}
            className="back-to-login ForgotPassword-text-sm ForgotPassword-text-green-400 ForgotPassword-hover:underline ForgotPassword-flex ForgotPassword-items-center"
          >
            <ArrowLeft className="ForgotPassword-h-4 ForgotPassword-w-4 ForgotPassword-mr-2" />{" "}
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
export default ForgotPasswordPage;
