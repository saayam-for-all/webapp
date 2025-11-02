import { useState, useEffect } from "react";
import { BiCog, BiDonateHeart } from "react-icons/bi";
import { FaHandshakeAngle } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { GET_NOTIFICATIONS } from "../../services/requestServices";
import { useNotifications } from "../../context/NotificationContext";
import { NotificationProvider } from "../../context/NotificationContext";
import { useTranslation } from "react-i18next";
import Pagination from "../../common/components/Pagination/Pagination";

export default function NotificationUI() {
  const [filter, setFilter] = useState("all");
  const { t } = useTranslation(["common"]);
  const { user } = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.idToken);
  const { dispatch, state } = useNotifications();
  const notifications = state.notifications;
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const typeIcons = {
    Volunteer: <BiDonateHeart className="mr-1 text-5xl md:text-6xl" />,
    helpRequest: <FaHandshakeAngle className="mr-1 text-5xl md:text-6xl" />,
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const filteredNotifications = sortedNotifications.filter((note) => {
    if (filter === "all") return true;
    if (filter === "help") return note.type !== "Volunteer";
    if (filter === "volunteer") return note.type === "Volunteer";
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
    // Also need to call a function whihch will update the data in the database cuch that this userid has acceoted the task.
    // It should be posting the status of the
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
    // Also need to call a function which will update the data in the database such that this userid has Denied the task
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
        {pageItems.map((note) => (
          <div
            key={note.id}
            className="p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex gap-2 md:gap-10 items-center">
              <div className="text-2xl sm:text-3xl">{typeIcons[note.type]}</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-base">
                  {note.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{note.message}</p>

                {note.title === t("NEW_MATCH_REQUEST") &&
                  !note.message.includes("✅") &&
                  !note.message.includes("❌") && (
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
              {note.date}
            </div>
          </div>
        ))}
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
