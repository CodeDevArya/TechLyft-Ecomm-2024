import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, error, isLoading, message } = useAuthStore();
  const { token } = useParams();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await resetPassword(token!, password);

      toast.success(
        "Password reset successfully, redirecting to login page..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Error resetting password");
      } else if (typeof error === "string") {
        toast.error(error);
      } else if (error && typeof error === "object" && "message" in error) {
        toast.error(
          (error as { message: string }).message || "Error resetting password"
        );
      } else {
        toast.error("Unknown error occurred");
      }
    }
  };

  return (
    <div className="reset-pass-main-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="ResetPass-max-w-md ResetPass-w-full ResetPass-bg-gray-800 ResetPass-bg-opacity-50 ResetPass-backdrop-filter ResetPass-backdrop-blur-xl ResetPass-rounded-2xl ResetPass-shadow-xl ResetPass-overflow-hidden"
      >
        <div className="ResetPass-p-8">
          <h2 className="ResetPass-text-3xl ResetPass-font-bold ResetPass-mb-6 ResetPass-text-center ResetPass-bg-gradient-to-r ResetPass-from-green-400 ResetPass-to-emerald-500 ResetPass-text-transparent ResetPass-bg-clip-text">
            Reset Password
          </h2>
          {error && (
            <p className="ResetPass-text-red-500 ResetPass-text-sm ResetPass-mb-4">
              {error}
            </p>
          )}
          {message && (
            <p className="ResetPass-text-green-500 ResetPass-text-sm ResetPass-mb-4">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              icon={Lock}
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              icon={Lock}
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="ResetPass-w-full ResetPass-py-3 ResetPass-px-4 ResetPass-bg-gradient-to-r ResetPass-from-green-500 ResetPass-to-emerald-600 ResetPass-text-white ResetPass-font-bold ResetPass-rounded-lg ResetPass-shadow-lg ResetPass-hover:from-green-600 ResetPass-hover:to-emerald-700 ResetPass-focus:outline-none ResetPass-focus:ring-2 ResetPass-focus:ring-green-500 ResetPass-focus:ring-offset-2 ResetPass-focus:ring-offset-gray-900 ResetPass-transition ResetPass-duration-200"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Set New Password"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
