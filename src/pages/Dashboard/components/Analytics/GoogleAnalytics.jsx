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

const ExpandIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
    />
  </svg>
);

const CollapseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
    />
  </svg>
);

const REPORTS = [
  {
    id: "overview",
    label: "Overview",
    src: "https://lookerstudio.google.com/embed/reporting/13ae30f7-e7d7-478f-93b5-5739fcc6260c/page/t2tlF",
  },
  {
    id: "detailed",
    label: "Detailed Reports",
    src: "https://lookerstudio.google.com/embed/reporting/f3f99330-c45d-4ae8-83b7-0399df523ccd/page/kIV1C",
  },
  {
    id: "pageviews",
    label: "Page Views",
    src: "https://lookerstudio.google.com/embed/reporting/eb599b30-0561-483a-8f07-c8abc651d749/page/cnelF",
  },
];

const getInitialTab = () => {
  const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_TAB);
  if (saved && REPORTS.some((r) => r.id === saved)) return saved;
  return REPORTS[0].id;
};

// Shared tab bar used in both normal and modal views
const TabBar = ({ activeTab, onTabChange, tabs, style = "normal" }) => (
  <>
    {/* Mobile */}
    <div className="sm:hidden flex-1">
      <select
        value={activeTab}
        onChange={(e) => onTabChange(e.target.value)}
        className="w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium text-sm focus:ring-2 focus:ring-blue-500"
      >
        {tabs.map((r) => (
          <option key={r.id} value={r.id}>
            {r.label}
          </option>
        ))}
      </select>
    </div>

    {/* Desktop */}
    <div className="hidden sm:flex flex-1 gap-1">
      {tabs.map((r) => (
        <button
          key={r.id}
          onClick={() => onTabChange(r.id)}
          className={`flex-1 py-1.5 px-3 text-sm font-semibold rounded transition-all duration-200 ${
            activeTab === r.id
              ? "bg-blue-500 text-white shadow-sm"
              : style === "modal"
                ? "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  </>
);

const GoogleAnalytics = () => {
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [isLoadingInline, setIsLoadingInline] = useState(true);
  const [isLoadingModal, setIsLoadingModal] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const activeReport = REPORTS.find((r) => r.id === activeTab);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_TAB, activeTab);
  }, [activeTab]);

  const handleTabChange = (reportId) => {
    if (reportId !== activeTab) {
      setIsLoadingInline(true);
      setIsLoadingModal(true);
      setActiveTab(reportId);
    }
  };

  const handleExpand = () => {
    setIsLoadingModal(true);
    setIsExpanded(true);
  };

  return (
    <>
      {/* ── Normal inline view (compact iframe) ── */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Tab bar + expand button */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50">
          <TabBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            tabs={REPORTS}
            style="normal"
          />
          <button
            onClick={handleExpand}
            title="Expand report"
            aria-label="Expand report"
            className="flex-shrink-0 p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <ExpandIcon />
          </button>
        </div>

        {/* Inline iframe — compact height */}
        <div
          className="relative"
          style={{ height: "calc(100vh - 260px)", minHeight: "420px" }}
        >
          {isLoadingInline && <Spinner />}
          {activeReport && (
            <iframe
              width="100%"
              height="100%"
              src={activeReport.src}
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen
              sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              title={activeReport.label}
              onLoad={() => setIsLoadingInline(false)}
              className={`transition-opacity duration-300 ${isLoadingInline ? "opacity-0" : "opacity-100"}`}
            />
          )}
        </div>
      </div>

      {/* ── Full-screen modal (maximize) ── */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsExpanded(false);
          }}
        >
          <div
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-7xl flex flex-col overflow-hidden"
            style={{ height: "92vh" }}
          >
            {/* Modal tab bar + close */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0">
              <TabBar
                activeTab={activeTab}
                onTabChange={handleTabChange}
                tabs={REPORTS}
                style="modal"
              />
              <button
                onClick={() => setIsExpanded(false)}
                title="Close"
                aria-label="Close expanded report"
                className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <CollapseIcon />
              </button>
            </div>

            {/* Modal iframe — fills remaining height */}
            <div className="relative flex-1 overflow-hidden">
              {isLoadingModal && <Spinner />}
              {activeReport && (
                <iframe
                  width="100%"
                  height="100%"
                  src={activeReport.src}
                  frameBorder="0"
                  style={{ border: 0 }}
                  allowFullScreen
                  sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                  title={`${activeReport.label} (expanded)`}
                  onLoad={() => setIsLoadingModal(false)}
                  className={`transition-opacity duration-300 ${isLoadingModal ? "opacity-0" : "opacity-100"}`}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleAnalytics;
