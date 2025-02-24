import React from "react";
import { useTranslation } from "react-i18next";
import CommentsSection from "./CommentsSection";
import RequestDescription from "./RequestDescription";
// import RequestDetailsSidebar from "./RequestDetailsSidebar";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import RequestButton from "../../common/components/RequestButton/RequestButton";
import { getComments, getMyRequests } from "../../services/requestServices";
import HelpingVolunteers from "./HelpingVolunteers";
const RequestDetails = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { id } = useParams();
  const [requestData, setRequestData] = useState(undefined);
  const [comments, setComments] = useState([]);

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
        <div className="col-span-7">
          <RequestDescription requestData={requestData} />
          <CommentsSection comments={comments} />

          <div className="mt-6 grid grid-cols-3 gap-4 w-full p-6 bg-white rounded-md shadow-md border border-gray-100">
            <RequestButton
              link="/voluntary-organizations"
              text={t("VOLUNTEER_ORGANIZATIONS")}
              customStyle="bg-blue-400 hover:bg-blue-600 text-white w-full px-6 py-3 rounded-lg flex items-center justify-start space-x-3 lg:text-md"
              icon="i-volunteer"
            />
            <RequestButton
              link=""
              text={t("EMERGENCY_CONTACT")}
              customStyle="bg-red-400 hover:bg-red-600 text-white w-full px-6 py-3 rounded-lg flex items-center justify-start space-x-3 text-md"
              icon="i-emergency"
            />
            <RequestButton
              isInfoRequest={true}
              text={t("MORE_INFORMATION")}
              customStyle="bg-yellow-500 hover:bg-yellow-600 text-white w-full px-6 py-3 rounded-lg flex items-center justify-start space-x-3 text-md"
              icon="i-info"
            />
          </div>

          <div className="mt-6">
            <HelpingVolunteers />
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetails;
