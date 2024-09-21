import React, { FC } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: FC<React.SVGProps<SVGSVGElement>>;
}

const Input: FC<InputProps> = ({ icon: Icon, ...props }) => {
  return (
    <div className="input-container">
      <div className="input-icon-container">
        <Icon className="input-icon" />
      </div>
      <input
        {...props}
        required
        className="input-field"
      />
    </div>
  );
};

export default Input;

