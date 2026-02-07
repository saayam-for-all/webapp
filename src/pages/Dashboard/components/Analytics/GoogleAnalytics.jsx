import { useState, useEffect } from "react";

const STORAGE_KEY_ACTIVE_TAB = "ga-active-tab";

const Spinner = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      <span className="text-gray-500 text-sm">Loading report...</span>
    </div>
  </div>
);

const REPORTS = [
  {
    id: "overview",
    label: "Overview",
    src: "https://lookerstudio.google.com/embed/reporting/13ae30f7-e7d7-478f-93b5-5739fcc6260c/page/t2tlF",
    height: 800,
  },
  {
    id: "detailed",
    label: "Detailed Reports",
    src: "https://lookerstudio.google.com/embed/reporting/f3f99330-c45d-4ae8-83b7-0399df523ccd/page/kIV1C",
    height: 800,
  },
  {
    id: "pageviews",
    label: "Page Views",
    src: "https://lookerstudio.google.com/embed/reporting/eb599b30-0561-483a-8f07-c8abc651d749/page/cnelF",
    height: 800,
  },
];

const getInitialTab = () => {
  const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_TAB);
  if (saved && REPORTS.some((r) => r.id === saved)) {
    return saved;
  }
  return REPORTS[0].id;
};

const GoogleAnalytics = () => {
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [isLoading, setIsLoading] = useState(true);

  const activeReport = REPORTS.find((r) => r.id === activeTab);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_TAB, activeTab);
  }, [activeTab]);

  const handleTabChange = (reportId) => {
    if (reportId !== activeTab) {
      setIsLoading(true);
      setActiveTab(reportId);
    }
  };

  return (
    <div className="pt-2 px-2 pb-2 sm:pt-3 sm:px-4 sm:pb-4 bg-gray-50 rounded-lg">
      {/* Mobile dropdown */}
      <div className="sm:hidden mb-2">
        <select
          value={activeTab}
          onChange={(e) => handleTabChange(e.target.value)}
          className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {REPORTS.map((report) => (
            <option key={report.id} value={report.id}>
              {report.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop/Tablet tabs */}
      <div className="hidden sm:flex mb-4">
        {REPORTS.map((report, index) => (
          <button
            key={report.id}
            className={`flex-1 py-2 px-2 md:py-2.5 md:px-4 text-center cursor-pointer font-semibold text-sm md:text-base rounded-t-lg transition-all duration-200
              ${
                activeTab === report.id
                  ? "bg-white text-blue-600 shadow-md border-b-2 border-blue-500"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 border-b-2 border-transparent"
              } ${index < REPORTS.length - 1 ? "mr-1" : ""}`}
            onClick={() => handleTabChange(report.id)}
          >
            {report.label}
          </button>
        ))}
      </div>

      {/* Report content */}
      <div className="relative bg-white rounded-b-lg shadow-sm overflow-hidden">
        {isLoading && <Spinner />}
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
            onLoad={() => setIsLoading(false)}
            className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"} w-full`}
          />
        )}
      </div>
    </div>
  );
};

export default GoogleAnalytics;
