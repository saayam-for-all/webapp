import { useState } from "react";

const REPORTS = [
  {
    id: "overview",
    label: "Overview",
    src: "https://lookerstudio.google.com/embed/reporting/13ae30f7-e7d7-478f-93b5-5739fcc6260c/page/t2tlF",
    height: 450,
  },
  {
    id: "detailed",
    label: "Detailed Reports",
    src: "https://lookerstudio.google.com/embed/reporting/f3f99330-c45d-4ae8-83b7-0399df523ccd/page/kIV1C",
    height: 2125,
  },
];

const GoogleAnalytics = () => {
  const [activeTab, setActiveTab] = useState(REPORTS[0].id);

  const activeReport = REPORTS.find((r) => r.id === activeTab);

  return (
    <div className="pt-2 px-4 pb-4 bg-gray-50">
      <div className="flex mb-4">
        {REPORTS.map((report, index) => (
          <button
            key={report.id}
            className={`flex-1 py-2 text-center cursor-pointer border-b-2 font-semibold
              ${
                activeTab === report.id
                  ? "bg-white text-blue-500 border-blue-500"
                  : "bg-gray-100 border-transparent hover:bg-gray-200"
              } ${index < REPORTS.length - 1 ? "mr-1" : ""}`}
            onClick={() => setActiveTab(report.id)}
          >
            {report.label}
          </button>
        ))}
      </div>

      <div>
        {activeReport && (
          <iframe
            width="100%"
            height={activeReport.height}
            src={activeReport.src}
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            title={activeReport.label}
          />
        )}
      </div>
    </div>
  );
};

export default GoogleAnalytics;
