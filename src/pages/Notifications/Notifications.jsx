import { useState, useEffect } from "react";
import { BiCog, BiDonateHeart, BiBell } from "react-icons/bi";
import { FaHandshakeAngle } from "react-icons/fa6";
import { useNotifications } from "../../context/NotificationContext";
import { useTranslation } from "react-i18next";
import Pagination from "../../common/components/Pagination/Pagination";

export default function NotificationUI() {
  const [filter, setFilter] = useState("all");
  const { t } = useTranslation(["common"]);
  const { dispatch, state } = useNotifications();
  const notifications = state.notifications;
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Icon + display label per notification type (API `typeName`).
  // Looked up case-insensitively so "HELP_REQUEST" / "help_request" both match.
  const typeConfig = {
    volunteer_match: {
      icon: <BiDonateHeart className="mr-1 text-5xl md:text-6xl" />,
      label: t("VOLUNTEER_MATCH"),
    },
    help_request: {
      icon: <FaHandshakeAngle className="mr-1 text-5xl md:text-6xl" />,
      label: t("HELP_REQUEST_BUTTON"),
    },
  };

  const getTypeConfig = (typeName) =>
    typeConfig[(typeName || "").toLowerCase()] || {
      icon: <BiBell className="mr-1 text-5xl md:text-6xl" />,
      label: t("NOTIFICATIONS"),
    };

  // "new" notifications get a highlighted background; everything else is default.
  const isNew = (note) => (note.status || "").toLowerCase() === "new";

  // Show Accept/Deny only when the record is flagged actionable and not yet acted on.
  const isActionable = (note) => {
    const flagOn =
      note.ActionItem === true ||
      String(note.ActionItem).toLowerCase() === "true";
    const alreadyActed =
      note.message?.includes("✅") || note.message?.includes("❌");
    return flagOn && !alreadyActed;
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createDttm) - new Date(a.createDttm),
  );

  const filteredNotifications = sortedNotifications.filter((note) => {
    const type = (note.typeName || "").toLowerCase();
    if (filter === "all") return true;
    if (filter === "help") return type === "help_request";
    if (filter === "volunteer") return type === "volunteer_match";
    return true;
  });

  const totalRows = filteredNotifications.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const startIdx = (currentPage - 1) * rowsPerPage;
  const pageItems = filteredNotifications.slice(
    startIdx,
    startIdx + rowsPerPage,
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const handleAccept = async (note) => {
    try {
      dispatch({
        type: "UPDATE_NOTIFICATION",
        payload: {
          id: note.id,
          data: {
            message: `✅ ${t("ACCEPT_SUCCESS_MESSAGE")}`,
            status: "accepted",
          },
        },
      });
    } catch (error) {
      console.error("Failed to accept:", error);
    }
  };

  const handleDeny = async (note) => {
    try {
      dispatch({
        type: "UPDATE_NOTIFICATION",
        payload: {
          id: note.id,
          data: {
            message: `❌ ${t("DENY_SUCCESS_MESSAGE")}`,
            status: "denied",
          },
        },
      });
    } catch (error) {
      console.error("Failed to deny:", error);
    }
  };

  const handleSettingsClick = () => {
    console.log("Settings clicked");
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-4 w-full">
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          {t("NOTIFICATIONS")}
        </h1>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-center">
        {["all", "volunteer", "help"].map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-full font-semibold ${
              filter === type
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-600 hover:text-blue-600"
            }`}
            onClick={() => {
              setFilter(type);
              setCurrentPage(1);
            }}
          >
            {type === "all"
              ? t("ALL")
              : type === "volunteer"
                ? t("VOLUNTEER_MATCH")
                : t("HELP_REQUEST_BUTTON")}
          </button>
        ))}
        <div className="ml-auto">
          <button className="p-2" onClick={handleSettingsClick}>
            <BiCog className="text-2xl text-gray-600 hover:text-blue-600 transition-colors duration-200" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-300 bg-white rounded-lg shadow">
        {pageItems.map((note) => {
          const config = getTypeConfig(note.typeName);
          return (
            <div
              key={note.id}
              className={`p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between ${
                isNew(note) ? "bg-blue-50" : "bg-white"
              }`}
            >
              <div className="flex gap-2 md:gap-10 items-center">
                <div className="text-2xl sm:text-3xl">{config.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-base">
                    {config.label}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{note.message}</p>

                  {isActionable(note) && (
                    <div className="mt-3 flex flex-wrap gap-4 sm:flex-nowrap">
                      <button
                        className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                        onClick={() => handleAccept(note)}
                      >
                        {t("ACCEPT")}
                      </button>
                      <button
                        className="flex-1 sm:flex-none border border-red-500 hover:bg-red-700 hover:text-white text-red-500 px-4 py-1 rounded"
                        onClick={() => handleDeny(note)}
                      >
                        {t("DENY")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-2 sm:mt-0 sm:text-right">
                {formatDate(note.createDttm)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          totalRows={totalRows}
          onRowsPerPageChange={(n) => {
            setRowsPerPage(n);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
}
