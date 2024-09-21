import { motion } from "framer-motion";
import { Loader, Lock, Mail, User, Calendar, ScanFace } from "lucide-react";
import { SetStateAction, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Input from "../components/Input";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState<Date>();
  const navigate = useNavigate();

  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e: any) => {
    e.preventDefault();
    if (gender.toLocaleLowerCase() !== ("male" || "female")) {
      return toast.error("Gender must be 'male' or 'female'");
    }
    try {
      signup(email, password, name, gender, dob!);
      navigate("/verify-email");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="sign-up-main-div">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="signup-container"
      >
        <div className="signup-content">
          <h2 className="signup-title">Create Account</h2>

          <form onSubmit={handleSignUp}>
            <div>
              <Input
                icon={User}
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setName(e.target.value)
                }
              />
            </div>
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setEmail(e.target.value)
              }
            />
            <Input
              icon={ScanFace}
              type="text"
              placeholder="Gender"
              value={gender}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setGender(e.target.value)
              }
            />
            <Input
              icon={Calendar}
              type="date"
              placeholder="D.O.B."
              onChange={(e) => setDob(new Date(e.target.value))}
            />
            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setPassword(e.target.value)
              }
            />
            {error && <p className="error-message red">{error}</p>}
            <PasswordStrengthMeter password={password} />

            <motion.button
              className="signup-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="signup-page-loader" size={25} />
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </form>
        </div>
        <div className="signup-footer">
          <p className="signup-footer-text">
            Already have an account?{" "}
            <Link to={"/login"} className="signup-footer-link">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
export default SignUpPage;
