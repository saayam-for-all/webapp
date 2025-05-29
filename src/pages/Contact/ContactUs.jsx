import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openFAQIndex, setOpenFAQIndex] = useState(null);

  const faqs = [
    {
      question: "What services does Saayam for All offer?",
      answer:
        "We offer a platform to connect volunteers with people who need help in areas like education, food, and healthcare.",
    },
    {
      question: "How can I become a volunteer?",
      answer:
        "Fill out the contact form and our team will reach out with onboarding steps!",
    },
    {
      question: "Is Saayam for All a non-profit?",
      answer:
        "Yes, we are a non-profit organization focused on community support and outreach.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
    } else if (!nameRegex.test(formData.firstName.trim())) {
      newErrors.firstName = "First Name should contain only letters";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required";
    } else if (!nameRegex.test(formData.lastName.trim())) {
      newErrors.lastName = "Last Name should contain only letters";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = "Phone number must be 10 digits";
    } else if (formData.phone.trim().length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }
    if (!formData.message) {
      newErrors.message = "Message is required";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      // Add submission logic here
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col p-8">
      <div className="flex flex-col md:flex-row w-full gap-6">
        {/* Left Column: Contact Info + FAQ */}
        <div className="flex flex-col w-full md:w-1/2 p-4">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-[#807D7D] text-lg mb-4">
            Email, call, or complete the form to learn how Saayam for All can
            help you with your challenges
          </p>
          <p className="text-[#807D7D] text-base mb-10">
            info@saayamforall.org
          </p>

          <h1 className="text-2xl font-bold mb-4">FAQ's</h1>
          <div className="w-full">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4 border-b border-gray-300 pb-2">
                <button
                  className="text-left w-full flex justify-between items-center font-medium text-gray-800"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <span>
                    {openFAQIndex === index ? (
                      <KeyboardArrowUpIcon className="text-gray-600" />
                    ) : (
                      <KeyboardArrowDownIcon className="text-gray-600" />
                    )}
                  </span>
                </button>
                {openFAQIndex === index && (
                  <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="w-full md:w-1/2 p-4">
          <Box
            component="form"
            onSubmit={handleSubmit}
            className="w-full max-w-2xl bg-white p-6 rounded-3xl shadow-md"
          >
            <h1 className="text-2xl font-bold mb-1">Get In Touch</h1>
            <p className="text-sm text-[#807D7D] mb-4">
              You can reach us anytime
            </p>

            {/* First Name */}
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="text-sm text-gray-800 font-medium mb-1 block leading-tight"
              >
                <span className="text-red-500 mr-1">*</span>First Name
              </label>
              <TextField
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                variant="outlined"
                fullWidth
                margin="dense"
                value={formData.firstName}
                onChange={handleChange}
                required
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="text-sm text-gray-800 font-medium mb-1 block leading-tight"
              >
                <span className="text-red-500 mr-1">*</span>Last Name
              </label>
              <TextField
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                variant="outlined"
                fullWidth
                margin="dense"
                value={formData.lastName}
                onChange={handleChange}
                required
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="text-sm text-gray-800 font-medium mb-1 block leading-tight"
              >
                <span className="text-red-500 mr-1">*</span>Email
              </label>
              <TextField
                id="email"
                name="email"
                placeholder="Enter your email"
                variant="outlined"
                fullWidth
                margin="dense"
                value={formData.email}
                onChange={handleChange}
                required
                error={!!errors.email}
                helperText={errors.email}
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="text-sm text-gray-800 font-medium mb-1 block leading-tight"
              >
                <span className="text-red-500 mr-1">*</span>Phone
              </label>
              <TextField
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                variant="outlined"
                fullWidth
                margin="dense"
                value={formData.phone}
                onChange={handleChange}
                required
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </div>

            {/* Message */}
            <div className="mb-4">
              <label
                htmlFor="message"
                className="text-sm text-gray-800 font-medium mb-1 block leading-tight"
              >
                <span className="text-red-500 mr-1">*</span>Message
              </label>
              <TextField
                id="message"
                name="message"
                placeholder="Type your message..."
                variant="outlined"
                fullWidth
                margin="dense"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                error={!!errors.message}
                helperText={errors.message}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="mt-4 rounded-[24px]"
              style={{
                borderRadius: "24px",
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Submit
            </Button>

            <p className="text-sm text-gray-500 mt-4 text-center">
              *By clicking Submit, you are agreeing to our{" "}
              <a href="#" className="text-blue-600">
                terms and conditions
              </a>
              .
            </p>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
