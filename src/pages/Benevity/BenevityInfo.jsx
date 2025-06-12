import React from "react";
import "./Benevity.css";

const companies = [
  { name: "Microsoft Employees", url: "https://microsoft.benevity.org/" },
  { name: "Amazon Employees", url: "https://amazon.benevity.org/" },
  { name: "Apple Employees", url: "https://apple.benevity.org/" },
  { name: "Google Employees", url: "https://google.benevity.org/" },
  { name: "Salesforce Employees", url: "https://salesforce.benevity.org/" },
  { name: "Oracle Employees", url: "https://oracle.benevity.org/" },
  { name: "Nvidia Employees", url: "https://nvidia.benevity.org/" },
  { name: "Visa Employees", url: "https://visa.benevity.org/" },
  { name: "Intel Employees", url: "https://intel.benevity.org/" },
  { name: "Cisco Employees", url: "https://cisco.benevity.org/" },
];

const BenevityInfo = () => (
  <div className="benevity-page-container">
    <header className="benevity-header">
      <h1>Double Your Impact through Benevity</h1>
      <p className="benevity-desc">
        Many companies offer donation or volunteer matching through Benevity.{" "}
        <br />
        If your employer is one of them, you can help Saayam for All even more.
      </p>
      <div className="benevity-info-card">
        <div>Charity Name: Saayam for All</div>
        <div>Charity Identifier: 840-932798273</div>
        <div>IRS Federal EIN: 9308382873</div>
        <a
          className="benevity-search-btn"
          href="https://benevity.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Search on Benevity
        </a>
      </div>
    </header>
    <section className="benevity-how-section">
      <h2>How to Donate</h2>
      <p className="benevity-how-desc">
        Follow these steps to donate or volunteer through Benevity.
      </p>
      <div className="benevity-how-steps">
        <div className="benevity-step">
          <div className="benevity-step-circle">1</div>
          <div className="benevity-icon-container">
            <svg
              className="benevity-step-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
              />
            </svg>
          </div>
          <div className="benevity-step-title">Go to Your Company's Portal</div>
          <div className="benevity-step-desc">
            Log in to your company's giving or volunteer portal where all your
            corporate social responsibility programs are listed.
          </div>
        </div>
        <div className="benevity-step">
          <div className="benevity-step-circle">2</div>
          <div className="benevity-icon-container">
            <svg
              className="benevity-step-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <div className="benevity-step-title">Search for "Saayam for All"</div>
          <div className="benevity-step-desc">
            Type "Saayam for All" into the portal's search bar to locate our
            cause and explore how you can support us.
          </div>
        </div>
        <div className="benevity-step">
          <div className="benevity-step-circle">3</div>
          <div className="benevity-icon-container">
            <svg
              className="benevity-step-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.815 3 8.25c0 7.219 2.912 11.38 7.514 14.026a2.25 2.25 0 002.972 0C18.088 19.63 21 15.469 21 8.25z"
              />
            </svg>
          </div>
          <div className="benevity-step-title">Log Your Hours or Donate</div>
          <div className="benevity-step-desc">
            Track your volunteer hours or make a financial donation – your
            company may even match your efforts!
          </div>
        </div>
      </div>
    </section>
    <section className="benevity-corporate-section">
      <h2>Corporate Matching and Giving Programs</h2>
      <p className="benevity-corp-desc">
        You can find the links for which you can donate.
      </p>
      <div className="benevity-corp-grid">
        {companies.map((c) => (
          <a
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="benevity-corp-card"
            key={c.name}
          >
            <div className="benevity-corp-name">{c.name}</div>
          </a>
        ))}
      </div>
    </section>
    {/* Footer can be reused from the main app layout */}
  </div>
);

export default BenevityInfo;
