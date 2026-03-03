import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdContactPhone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import { useSelector } from "react-redux";
import {
  getEmergencyContactInfo,
  moreInformation,
  moreInformationChat,
} from "../../../services/requestServices";
import MoreInfoChatModal from "../MoreInfoChatModal/MoreInfoChatModal";

const COOLDOWN_MS = 30 * 60 * 1000;

const getCooldownKey = (data) =>
  `moreInfoCooldown_${data?.id ?? data?.subject ?? "default"}`;

const isCoolingDown = (data) => {
  const raw = localStorage.getItem(getCooldownKey(data));
  if (!raw) return false;
  const { expiresAt } = JSON.parse(raw);
  if (Date.now() < expiresAt) return true;
  localStorage.removeItem(getCooldownKey(data)); // expired, clean up
  return false;
};

const buildPayload = (requestData) => ({
  category_id: requestData.category ?? "",
  subject: requestData.subject ?? "",
  description: requestData.description ?? "",
  location: requestData.location ?? "",
  gender: requestData.gender ?? "",
  age: requestData.age ?? "",
});

const RequestButton = ({
  link,
  text,
  isInfoRequest,
  customStyle,
  icon,
  requestData = {},
  onClick,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showCooldownDialog, setShowCooldownDialog] = useState(false);
  const [responseContent, setResponseContent] = useState(null);
  const [initialResponse, setInitialResponse] = useState("");
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleClick = async () => {
    if (onClick) {
      onClick();
      return;
    }

    if (isInfoRequest) {
      try {
        if (text === "Emergency Contact") {
          const response = await getEmergencyContactInfo();
          const country = user.zoneinfo;
          const emergencyContact = response.body[country];
          setResponseContent(
            <div>
              <span>
                {country}: {emergencyContact}
              </span>
            </div>,
          );
          setShowModal(true);
          return;
        }

        // More Information flow — check cooldown first
        if (isCoolingDown(requestData)) {
          setShowCooldownDialog(true);
          return;
        }

        const aiReply = await moreInformation(requestData);
        setInitialResponse(
          typeof aiReply === "string" ? aiReply : JSON.stringify(aiReply),
        );
        setShowModal(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        setResponseContent(
          <p>An error occurred while fetching the information.</p>,
        );
        setShowModal(true);
      }
    } else {
      navigate(link);
    }
  };

  const handleChatClose = () => {
    setShowModal(false);
  };

  const getIcon = () => {
    switch (icon) {
      case "i-info":
        return <FaInfoCircle size={25} />;
      case "i-volunteer":
        return <FaPeopleGroup size={25} />;
      case "i-emergency":
        return <MdContactPhone size={25} />;
      default:
        return null;
    }
  };

  const isMoreInfo = isInfoRequest && text !== "Emergency Contact";
  const isEmergency = isInfoRequest && text === "Emergency Contact";

  return (
    <>
      <button
        onClick={handleClick}
        className={`${customStyle} h-12 flex items-center justify-center sm:justify-center lg:justify-start`}
      >
        <span>{getIcon()}</span>
        <span className="hidden lg:inline">{text}</span>
      </button>

      {/* Emergency contact / fallback modal */}
      {isEmergency && (
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          {responseContent}
        </Modal>
      )}

      {/* Chat modal for More Information */}
      {isMoreInfo && (
        <MoreInfoChatModal
          show={showModal}
          onClose={handleChatClose}
          requestData={requestData}
          initialResponse={initialResponse}
        />
      )}

      {/* Cooldown dialog */}
      <Modal
        show={showCooldownDialog}
        onClose={() => setShowCooldownDialog(false)}
      >
        <p className="text-gray-700">
          You have reached the question limit. Please try again after 30
          minutes.
        </p>
      </Modal>
    </>
  );
};

export default RequestButton;
