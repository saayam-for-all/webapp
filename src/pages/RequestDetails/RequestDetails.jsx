import React from "react";
import { useTranslation } from "react-i18next";
// import RequestDetailsSidebar from "./RequestDetailsSidebar";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useParams } from "react-router-dom";
import RequestButton from "../../common/components/RequestButton/RequestButton";
import { getComments, getMyRequests } from "../../services/requestServices";
import HelpRequestForm from "../HelpRequest/HelpRequestForm";
import CommentsSection from "./CommentsSection";
import HelpingVolunteers from "./HelpingVolunteers";
import RequestDescription from "./RequestDescription";

const RequestDetails = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { id } = useParams();
  const [requestData, setRequestData] = useState(undefined);
  const [comments, setComments] = useState([]);
  const [tab, setTab] = useState("Comments");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEditing) {
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      document.body.style.overflow = "unset"; // Restore background scrolling
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
          setRequestData(res["body"].filter((req) => req["id"] === id)[0]);
        })
        .catch((err) => {});
    }
    getComments()
      .then((res) => {
        setComments(res["body"]);
      })
      .catch((err) => {});
  }, []);

  return (
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
                    onClose={() => setIsEditing(false)}
                  />
                </div>
              </div>,
              document.body,
            )}
          <div className="flex flex-row justify-between md:items-center">
            <h2 className="text-2xl font-semibold lg:flex sm:items-center sm:gap-5 uppercase">
              {requestData.subject}
            </h2>
            {/**Edit Button was previously here */}
          </div>
          <div className="flex flex-row justify-between">
            <RequestButton
              link="/voluntary-organizations"
              text={t("VOLUNTEER_ORGANIZATIONS")}
              customStyle="bg-blue-400 hover:bg-blue-600 text-white w-[30%] px-6 py-3 rounded-lg flex items-center justify-start space-x-3 lg:text-md"
              icon="i-volunteer"
            />
            <RequestButton
              link=""
              text={t("EMERGENCY_CONTACT")}
              customStyle="bg-red-400 hover:bg-red-600 text-white w-[30%] px-6 py-3 rounded-lg flex items-center justify-start space-x-3 text-md"
              icon="i-emergency"
            />
            <RequestButton
              isInfoRequest={true}
              text={t("MORE_INFORMATION")}
              customStyle="bg-yellow-500 hover:bg-yellow-600 text-white w-[30%] px-6 py-3 rounded-lg flex items-center justify-start space-x-3 text-md"
              icon="i-info"
            />
          </div>
          <div className="bg-white border border-gray-200 shadow-md m-0 flex flex-col">
            <div className="flex flex-row justify-evenly w-full">
              {["Comments", "Volunteers", "Details"].map(
                (newTab, index, array) => (
                  <button
                    key={newTab}
                    className={`flex-1 py-3 text-center cursor-pointer font-bold w-1/3 ${
                      newTab === tab
                        ? "bg-white border-gray-300 border-b-2 border-l-2 border-r-2"
                        : "bg-gray-300 border-transparent hover:bg-gray-200"
                    } ${index < array.length - 1 ? "mr-4" : ""} `}
                    onClick={() => setTab(newTab)}
                  >
                    {t(newTab)}
                  </button>
                ),
              )}
            </div>
            <div className="p-4">
              {tab === "Comments" ? (
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
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetails;
