import { FaSpinner } from "react-icons/fa";

const Loader = () => {
  return (
    <div className="navbar-spinner">
      <FaSpinner className="navbar-spinner-icon" />
    </div>
  );
};

export default Loader;
