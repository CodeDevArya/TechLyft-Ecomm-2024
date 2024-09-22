import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const { error, isLoading, verifyEmail } = useAuthStore();

  const handleChange = (index: number, value: any) => {
    const newCode = [...code];

    // Handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // Focus on the last non-empty input or the first empty one
      const lastFilledIndex = newCode.findIndex(
        (digit, index) => digit !== "" && index === newCode.length - 1
      );
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: any) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const verificationCode = code.join("");
    try {
      await verifyEmail(verificationCode);
      navigate("/");
      toast.success("Email verified successfully");
    } catch (error) {
      console.log(error);
    }
  };

  // Auto submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div className="verify-pass-main-container">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="verifyEmail-bg-gray-800 verifyEmail-bg-opacity-50 verifyEmail-backdrop-filter verifyEmail-backdrop-blur-xl verifyEmail-rounded-2xl verifyEmail-shadow-2xl verifyEmail-p-8 verifyEmail-w-full verifyEmail-max-w-md"
      >
        <h2 className="verifyEmail-text-3xl verifyEmail-font-bold verifyEmail-mb-6 verifyEmail-text-center verifyEmail-bg-gradient-to-r verifyEmail-from-green-400 verifyEmail-to-emerald-500 verifyEmail-text-transparent verifyEmail-bg-clip-text">
          Verify Your Email
        </h2>
        <p className="verifyEmail-text-center verifyEmail-text-gray-300 verifyEmail-mb-6">
          Enter the 6-digit code sent to your email address.
        </p>

        <form onSubmit={handleSubmit} className="verifyEmail-space-y-6">
          <div className="verifyEmail-flex verifyEmail-justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="verifyEmail-w-12 verifyEmail-h-12 verifyEmail-text-center verifyEmail-text-2xl verifyEmail-font-bold verifyEmail-bg-gray-700 verifyEmail-text-white verifyEmail-border-2 verifyEmail-border-gray-600 verifyEmail-rounded-lg verifyEmail-focus:border-green-500 verifyEmail-focus:outline-none"
              />
            ))}
          </div>
          {error && (
            <p className="verifyEmail-text-red-500 red verifyEmail-font-semibold verifyEmail-mt-2">
              {error}
            </p>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            className="verifyEmail-w-full verifyEmail-bg-gradient-to-r verifyEmail-from-green-500 verifyEmail-to-emerald-600 verifyEmail-text-white verifyEmail-font-bold verifyEmail-py-3 verifyEmail-px-4 verifyEmail-rounded-lg verifyEmail-shadow-lg verifyEmail-hover:from-green-600 verifyEmail-hover:to-emerald-700 verifyEmail-focus:outline-none verifyEmail-focus:ring-2 verifyEmail-focus:ring-green-500 verifyEmail-focus:ring-opacity-50 verifyEmail-disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
export default EmailVerificationPage;
