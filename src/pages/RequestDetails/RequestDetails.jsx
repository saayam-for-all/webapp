import { useTranslation } from "react-i18next";
// import RequestDetailsSidebar from "./RequestDetailsSidebar";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoPersonCircle } from "react-icons/io5";
import { RiUserStarLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import RequestButton from "../../common/components/RequestButton/RequestButton";
import {
  getComments,
  getMyRequests,
  deleteRequest,
} from "../../services/requestServices";
import HelpRequestForm from "../HelpRequest/HelpRequestForm";
import CommentsSection from "./CommentsSection";
import HelpingVolunteers from "./HelpingVolunteers";
import RequestDescription from "./RequestDescription";
import EmergencyContact from "../EmergencyContact/EmergencyContact";
import { createOrganizationsPageState } from "../../common/components/BreadCrumbs/breadcrumbUtils";
import { FiPaperclip } from "react-icons/fi";
import { FaMicrophone } from "react-icons/fa";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const RequestDetails = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { id } = useParams();
  const [requestData, setRequestData] = useState(undefined);
  const [comments, setComments] = useState([]);
  const [tab, setTab] = useState("Comments");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [showEmergency, setShowEmergency] = useState(false);
  const requestId = id || location.state?.id;
  const [showAttachmentsDialog, setShowAttachmentsDialog] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);
  const userDbId = useSelector((state) => state.auth.user?.userDbId);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [changeVolunteerDialogOpen, setChangeVolunteerDialogOpen] =
    useState(false);
  const [volunteerChangeReason, setVolunteerChangeReason] = useState("");

  useEffect(() => {
    if (isEditing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isEditing]);

  useEffect(() => {
    if (location["state"]) {
      setRequestData(location["state"]);
    } else {
      getMyRequests()
        .then((res) => {
          const found = res["body"].filter((req) => req["id"] === id)[0];
          setRequestData(found);
        })
        .catch(() => {});
    }
    getComments()
      .then((res) => {
        setComments(res["body"]);
      })
      .catch(() => {});
  }, []);

  const getFullName = (...parts) => parts.filter(Boolean).join(" ").trim();

  const currentUserName =
    getFullName(currentUser?.given_name, currentUser?.family_name) ||
    getFullName(currentUser?.firstName, currentUser?.lastName) ||
    currentUser?.name ||
    currentUser?.email ||
    "";

  const isMyRequest =
    requestData?.sourceDashboard === "BENEFICIARY" ||
    requestData?.sourceTab === "myRequests";

  const creatorName =
    requestData?.creatorName ||
    requestData?.createdByName ||
    requestData?.requesterName ||
    getFullName(requestData?.creatorFirstName, requestData?.creatorLastName) ||
    getFullName(
      requestData?.createdByFirstName,
      requestData?.createdByLastName,
    ) ||
    getFullName(
      requestData?.requesterFirstName,
      requestData?.requesterLastName,
    ) ||
    (isMyRequest ? currentUserName : "") ||
    t("CREATOR");

  const beneficiaryName =
    requestData?.beneficiaryName ||
    requestData?.beneficiaryFullName ||
    getFullName(
      requestData?.beneficiaryFirstName,
      requestData?.beneficiaryLastName,
    ) ||
    getFullName(requestData?.reqFname, requestData?.reqLname) ||
    getFullName(
      requestData?.guestDetails?.reqFname,
      requestData?.guestDetails?.reqLname,
    ) ||
    (isMyRequest ? currentUserName : "") ||
    "Beneficiary";

  const attributes = [
    {
      context: beneficiaryName,
      type: "Beneficiary",
      icon: <IoPersonCircle size={26} />,
      isClickable: true,
    },
    {
      context: creatorName,
      type: "CREATOR",
      icon: <IoPersonCircle size={26} />,
      isClickable: true,
    },
    {
      context: "Ethan Marshall",
      type: "LEAD_VOLUNTEER",
      icon: <RiUserStarLine size={22} />,
      isClickable: true,
    },
  ];

  const organizationsNavigationState = createOrganizationsPageState({
    requestId,
    requestData,
    requestLabel: t("REQUEST_DETAILS"),
    organizationsLabel: t("ORGANIZATIONS"),
  });

  const attachmentUrls = Array.isArray(requestData?.attachments)
    ? requestData.attachments.filter(Boolean)
    : [];

  // Support a few possible audio keys
  const audioUrl =
    requestData?.audioUrl ||
    requestData?.audio_url ||
    requestData?.audio_file_url ||
    requestData?.audioFileUrl ||
    null;

  const fileCount = attachmentUrls.length;
  const truncateName = (name, max = 45) =>
    name && name.length > max ? `${name.slice(0, max)}...` : name;

  const fileNameFromUrl = (url) => {
    try {
      const last = String(url).split("/").pop() || "attachment";
      return decodeURIComponent(last.split("?")[0]) || "attachment";
    } catch {
      return "attachment";
    }
  };

  // NEW: handlers (same behavior you had before)
  const handleDeleteRequest = async () => {
    setIsDeleting(true);
    setDeleteError("");
    try {
      // requesterId resolution mirrors the Edit flow:
      // - My Requests tab -> logged-in user's userDbId (from Redux)
      // - All Requests tab -> requesterId comes from the request object itself
      const payload = {
        requestId: requestData?.id || requestId,
        requesterId: isMyRequest
          ? userDbId
          : requestData?.requesterId || userDbId,
      };

      // NOTE (SAAYAM-1700): "reason" (deleteReason) is captured in the UI but
      // NOT sent yet — the delete API doesn't accept a reason param yet.
      // Once backend adds support, include it here, e.g.:
      //   await deleteRequest({ ...payload, reason: deleteReason });
      await deleteRequest(payload);

      setDeleteDialogOpen(false);
      setDeleteReason("");
      navigate("/dashboard");
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteError("Failed to delete request. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChangeVolunteer = async () => {
    try {
      setChangeVolunteerDialogOpen(false);
      setVolunteerChangeReason("");
      navigate("/dashboard");
    } catch (error) {
      console.error("Volunteer change failed:", error);
    }
  };

  return (
    <div>
      <div className="w-full px-4 mb-4">
        <h1 className="text-2xl font-semibold text-center">
          {t("REQUEST_DETAILS")}
        </h1>
      </div>

      <div className="m-8 grid grid-cols-13 gap-4">
        {!requestData ? (
          <div>Loading...</div>
        ) : (
          <div
            className="rounded-lg bg-white border border-gray-200 shadow-md p-4 sm:p-6 m-0 flex flex-col gap-4"
            data-testid="handleToggleContainer"
          >
            {isEditing &&
              createPortal(
                <div
                  className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
                  onClick={() => setIsEditing(false)}
                >
                  <div
                    className="overflow-auto max-h-[100vh]"
                    onClick={(e) => e.stopPropagation()}
                    id="request-description-popup"
                  >
                    <HelpRequestForm
                      isEdit={true}
                      onClose={(updatedData) => {
                        if (updatedData) {
                          setRequestData((prev) => ({
                            ...prev,
                            ...updatedData,
                            subject:
                              updatedData.requestSubject || updatedData.subject,
                            description:
                              updatedData.requestDescription ||
                              updatedData.description,
                            priority:
                              updatedData.requestPriority?.priority ||
                              updatedData.priority,
                            type:
                              updatedData.requestType?.type || updatedData.type,
                          }));
                        }
                        setIsEditing(false);
                      }}
                      editRequestData={requestData}
                    />
                  </div>
                </div>,
                document.body,
              )}

            {/* Header row: subject (left) + ACTION BUTTONS (top-right) */}
            <div className="flex flex-row justify-between md:items-center gap-4">
              <h2 className="text-2xl font-semibold lg:flex sm:items-center sm:gap-5 capitalize">
                {requestData.subject}{" "}
                <span className="text-gray-500 text-base font-normal">
                  ({requestId})
                </span>
              </h2>
            </div>

            <div className="flex flex-row gap-5 justify-between">
              {attributes.map((header, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 group relative"
                >
                  {header.icon}
                  {header.isClickable ? (
                    <button
                      onClick={() =>
                        navigate("/profile", {
                          state: {
                            activeTab: "profile",
                            beneficiaryId: header.beneficiaryId,
                          },
                        })
                      }
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer transition-colors duration-200"
                    >
                      {header.context}
                    </button>
                  ) : (
                    <span>{header.context}</span>
                  )}
                  <div className="absolute top-6 px-5 py-2 bg-gray-50 border shadow-md rounded-xl flex whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {t(header.type)}
                  </div>
                </li>
              ))}
            </div>

            <div className="flex flex-row justify-between">
              <RequestButton
                link="/voluntary-organizations"
                text={t("ORGANIZATIONS")}
                customStyle="bg-blue-400 hover:bg-blue-600 text-white w-[30%] px-6 py-3 rounded-lg flex items-center justify-start space-x-3 lg:text-md"
                icon="i-volunteer"
                requestData={requestData}
                navigationState={organizationsNavigationState}
              />
              <RequestButton
                onClick={() => setShowEmergency(true)}
                text={t("EMERGENCY_CONTACT")}
                customStyle="bg-red-400 hover:bg-red-600 text-white w-[30%] px-6 py-3 rounded-lg flex items-center justify-start space-x-3 text-md"
                icon="i-emergency"
              />
              <RequestButton
                isInfoRequest={true}
                text={t("MORE_INFORMATION")}
                customStyle="bg-yellow-500 hover:bg-yellow-600 text-white w-[30%] px-6 py-3 rounded-lg flex items-center justify-start space-x-3 text-md"
                icon="i-info"
                requestData={requestData}
              />
            </div>

            <div className="bg-white border border-gray-200 shadow-md m-0 flex flex-col">
              <div className="w-full">
                <div className="flex w-full bg-gray-200 gap-px">
                  {[
                    { key: "COMMENTS", value: "Comments" },
                    { key: "VOLUNTEERS", value: "Volunteers" },
                    { key: "DETAILS", value: "Details" },
                  ].map(({ key, value }) => {
                    const isActive = value === tab;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setShowEmergency(false);
                          setTab(value);
                        }}
                        className={[
                          "flex-1 py-3 text-center font-semibold",
                          isActive
                            ? "bg-white text-blue-600 border-b-2 border-blue-600"
                            : "bg-gray-300 text-gray-800 border-b-2 border-transparent hover:bg-gray-200",
                        ].join(" ")}
                      >
                        {t(key)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative p-4 pt-16">
                {/* Orange area actions (only on Details tab) */}
                {tab === "Details" && (
                  <div className="absolute top-4 right-4 flex items-center gap-3 flex-wrap">
                    <button
                      className="bg-blue-500 text-white text-sm px-6 py-2 rounded-lg hover:bg-blue-600"
                      onClick={() => setIsEditing(true)}
                    >
                      {t("EDIT")}
                    </button>

                    <button
                      className="bg-blue-500 text-white text-sm px-6 py-2 rounded-lg hover:bg-blue-600"
                      onClick={() => setChangeVolunteerDialogOpen(true)}
                    >
                      {t("CHANGE_VOLUNTEER")}
                    </button>

                    <button
                      className="bg-red-500 text-white text-sm px-6 py-2 rounded-lg hover:bg-red-600"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      {t("DELETE")}
                    </button>
                  </div>
                )}
                {showEmergency ? (
                  <EmergencyContact embedded />
                ) : tab === "Comments" ? (
                  <CommentsSection comments={comments} />
                ) : tab === "Volunteers" ? (
                  <HelpingVolunteers />
                ) : (
                  <RequestDescription
                    requestData={requestData}
                    setIsEditing={setIsEditing}
                  />
                )}
              </div>

              {tab === "Details" && (
                <div className="px-4 pb-4 pt-4 flex flex-col gap-3">
                  {/* Bottom-right attachments/audio */}
                  <div className="flex justify-end">
                    <div className="flex items-center gap-3">
                      {audioUrl && (
                        <a
                          href={audioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 border border-gray-300 rounded-lg bg-white shadow-sm px-2 py-1 hover:bg-gray-50"
                          title="Download audio"
                        >
                          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-500 text-white">
                            <FaMicrophone size={16} />
                          </div>
                          <span className="text-sm text-gray-700 px-1 py-1">
                            Audio attached
                          </span>
                        </a>
                      )}

                      <div
                        className={`flex items-center gap-2 border border-gray-300 rounded-lg bg-white shadow-sm px-1 py-1 select-none ${
                          fileCount > 0
                            ? "cursor-pointer"
                            : "opacity-60 cursor-not-allowed"
                        }`}
                        onClick={() => {
                          if (fileCount > 0) setShowAttachmentsDialog(true);
                        }}
                        title={
                          fileCount > 0
                            ? "View attached files"
                            : "No files attached"
                        }
                      >
                        <div className="flex items-center justify-center w-9 h-9 rounded-full text-white bg-blue-500">
                          <FiPaperclip size={18} />
                        </div>
                        <span className="text-sm text-gray-700 hover:bg-gray-200 rounded px-1 py-1">
                          {fileCount > 0
                            ? `${fileCount} ${fileCount === 1 ? "file attached" : "files attached"}`
                            : "No files"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Dialog
              open={showAttachmentsDialog}
              onClose={() => setShowAttachmentsDialog(false)}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>Attached Files</DialogTitle>
              <DialogContent>
                {attachmentUrls.length === 0 ? (
                  <Typography variant="body2">No files attached.</Typography>
                ) : (
                  <ul className="mt-2">
                    {attachmentUrls.map((url, i) => (
                      <li
                        key={`${url}-${i}`}
                        className="py-2 flex items-center justify-between gap-3 border-b last:border-b-0"
                      >
                        <span
                          className="text-sm text-gray-800"
                          title={fileNameFromUrl(url)}
                        >
                          {truncateName(fileNameFromUrl(url))}
                        </span>
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Download
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setShowAttachmentsDialog(false)}
                  variant="contained"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            {/* Delete dialog (now outside grey box) */}
            <Dialog
              open={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
            >
              <DialogTitle>{t("DELETE")}</DialogTitle>
              <DialogContent>
                <Typography>{t("REASON")}</Typography>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="border p-2 w-full mt-3 rounded-lg min-h-[100px]"
                  placeholder={t("REASON")}
                />
                {deleteError && (
                  <Typography color="error" variant="body2" className="mt-2">
                    {deleteError}
                  </Typography>
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setDeleteDialogOpen(false)}
                  variant="outlined"
                >
                  {t("CANCEL")}
                </Button>
                <Button
                  onClick={handleDeleteRequest}
                  color="error"
                  variant="contained"
                  disabled={!deleteReason.trim() || isDeleting}
                >
                  {isDeleting ? "Deleting..." : t("DELETE")}
                </Button>
              </DialogActions>
            </Dialog>

            {/* Change volunteer dialog (now outside grey box) */}
            <Dialog
              open={changeVolunteerDialogOpen}
              onClose={() => setChangeVolunteerDialogOpen(false)}
            >
              <DialogTitle>
                {t("PLEASE_SPECIFY_REASON_FOR_CHANGE_OF_VOLUNTEER")}
              </DialogTitle>
              <DialogContent>
                <textarea
                  value={volunteerChangeReason}
                  onChange={(e) => setVolunteerChangeReason(e.target.value)}
                  className="border p-2 w-full rounded-lg min-h-[100px]"
                  placeholder={t("REASON")}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setChangeVolunteerDialogOpen(false)}
                  variant="outlined"
                >
                  {t("CANCEL")}
                </Button>
                <Button
                  onClick={handleChangeVolunteer}
                  color="primary"
                  variant="contained"
                  disabled={!volunteerChangeReason.trim()}
                >
                  {t("CHANGE_VOLUNTEER")}
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDetails;
