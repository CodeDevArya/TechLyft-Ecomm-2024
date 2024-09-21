import { Check, X } from "lucide-react";

const PasswordCriteria = ({ password }: { password: string }) => {
  const criteria = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="password-criteria-container">
      {criteria.map((item) => (
        <div key={item.label} className="password-criteria-item">
          {item.met ? (
            <Check className="password-criteria-icon met" />
          ) : (
            <X className="password-criteria-icon unmet" />
          )}
          <span className={item.met ? "password-criteria-text met" : "password-criteria-text unmet"}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const getStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
    if (pass.match(/\d/)) strength++;
    if (pass.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };
  const strength = getStrength(password);

  const getColor = (strength: number) => {
    if (strength === 0) return "strength-bar red";
    if (strength === 1) return "strength-bar red-light";
    if (strength === 2) return "strength-bar yellow";
    if (strength === 3) return "strength-bar yellow-light";
    return "strength-bar green";
  };

  const getStrengthText = (strength: number) => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="password-strength-meter-container">
      <div className="strength-meter-header">
        <span className="strength-meter-label">Password strength</span>
        <span className="strength-meter-text">{getStrengthText(strength)}</span>
      </div>

      <div className="strength-bars-container">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`strength-bar ${index < strength ? getColor(strength) : "bg-gray-600"}`}
          />
        ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  );
};
export default PasswordStrengthMeter;
