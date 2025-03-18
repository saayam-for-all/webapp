import React from "react";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = React.useState({});
  const inputChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const fromSubmitHandler = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  return (
    <div className="flex items-center justify-center flex-col gap-5 mt-5">
      <h1>{t("ENTER_DETAILS")}</h1>
      <form
        className="w-2/5 flex flex-col gap-5"
        // onSubmit={fromSubmitHandler}
        action="https://formsubmit.co/info@saayamforall.com"
        method="POST"
      >
        <label
          for="firstName"
          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
        >
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName || ""}
            onChange={inputChangeHandler}
            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 input-md"
            placeholder="First Name"
          />

          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
            {t("FIRST_NAME")}
          </span>
        </label>
        <label
          for="lastName"
          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
        >
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName || ""}
            onChange={inputChangeHandler}
            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 input-md"
            placeholder="Last Name"
          />

          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
            {t("LAST_NAME")}
          </span>
        </label>
        <label
          for="email"
          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
        >
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ""}
            onChange={inputChangeHandler}
            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 input-md"
            placeholder="Email"
          />

          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
            {t("EMAIL")}
          </span>
        </label>
        <label
          for="phone"
          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
        >
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone || ""}
            onChange={inputChangeHandler}
            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 input-md"
            placeholder="Phone"
          />

          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
            {t("PHONE")}
          </span>
        </label>
        <label
          for="message"
          className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
        >
          <textarea
            rows={6}
            id="message"
            name="message"
            value={formData.message || ""}
            onChange={inputChangeHandler}
            className="w-full peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 input-md"
            placeholder="Enter your Message"
          />

          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
            {t("MESSAGE")}
          </span>
        </label>
        <button className="btn btn-accent" type="submit">
          {t("SUBMIT")}
        </button>
      </form>
    </div>
  );
};

export default Contact;
