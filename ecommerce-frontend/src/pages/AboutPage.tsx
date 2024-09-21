import { useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import { useUserStrore } from "../store/userStore";
import toast from "react-hot-toast";

const AboutPage = () => {
  const { sendMail } = useUserStrore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [submitStatus, setSubmitStatus] = useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevErrors: any) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validateForm = () => {
    let tempErrors: any = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)
    ) {
      tempErrors.email = "Invalid email address";
    }
    if (!formData.message.trim()) tempErrors.message = "Message is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async(e: any) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitStatus("submitting");
      const res: any = await sendMail(
        formData.name,
        formData.email,
        formData.message
      );
      if (res.success) {
        setSubmitStatus("success");
        return setFormData({ name: "", email: "", message: "" });
      }
      setSubmitStatus("error");
      toast.error("Error sending message");
    }
  };

  return (
    <div className="container about-page">
      <div className="Aboutcontainer">
        <h1 className="title">About Us</h1>

        <div className="mission-card">
          <div className="flex-container">
            <div className="image-container">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                alt="Team"
                className="team-image"
              />
            </div>
            <div className="text-content">
              <h2 className="sub-title">Our Mission</h2>
              <p className="description">
                We are dedicated to delivering innovative solutions that empower
                businesses and individuals to thrive in the digital age. Our
                team of experts combines creativity with technical expertise to
                create outstanding web experiences.
              </p>
              <p className="description">
                With a focus on user-centric design and cutting-edge technology,
                we strive to exceed expectations and drive meaningful results
                for our clients.
              </p>
            </div>
          </div>
        </div>

        <h1 className="contact-title">Contact Us</h1>
        <div className="contact-card">
          <div className="flex-container">
            <div className="contact-info">
              <h3 className="contact-subtitle">Get in Touch</h3>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>techlyft.official@gmail.com</span>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+91 98711XXXXX</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>123 Web Dev Lane, Internet City, 12345</span>
              </div>
              <div className="social-links">
                <a href="#" className="social-link">
                  <FaFacebook size={24} />
                </a>
                <a href="#" className="social-link">
                  <FaTwitter size={24} />
                </a>
                <a href="#" className="social-link">
                  <FaLinkedin size={24} />
                </a>
              </div>
            </div>

            <div className="form-container">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-input ${errors.name ? "error-input" : ""}`}
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="error-message">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${
                      errors.email ? "error-input" : ""
                    }`}
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="error-message">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className={`form-textarea ${
                      errors.message ? "error-input" : ""
                    }`}
                    aria-invalid={errors.message ? "true" : "false"}
                    aria-describedby={
                      errors.message ? "message-error" : undefined
                    }
                  ></textarea>
                  {errors.message && (
                    <p id="message-error" className="error-message">
                      {errors.message}
                    </p>
                  )}
                </div>
                <div>
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={submitStatus === "submitting"}
                  >
                    {submitStatus === "submitting"
                      ? "Sending..."
                      : "Send Message"}
                  </button>
                </div>
              </form>
              {submitStatus === "success" && (
                <div className="success-alert" role="alert">
                  <p className="alert-title">Thank you for your message!</p>
                  <p>We'll get back to you soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
