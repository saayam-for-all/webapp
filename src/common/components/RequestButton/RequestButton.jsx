import React, { useState, useEffect } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdContactPhone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Markdown from "react-markdown";
import Modal from "../Modal/Modal";
import { useSelector } from "react-redux";
import { getEmergencyContactInfo } from "../../../services/requestServices";
import { moreInformation } from "../../../services/requestServices";

const ExpandableMarkdown = ({ children }) => {
  const [showMore, setShowMore] = useState(false);
  const [text, setText] = useState("");
  useEffect(() => {
    setText(children);
  }, []);
  return (
    <>
      {showMore ? (
        <Markdown>{text}</Markdown>
      ) : (
        <Markdown>{text.substring(0, 500)}</Markdown>
      )}
      <button
        onClick={() => setShowMore(!showMore)}
        className="text-blue-600 font-medium focus:outline-none"
      >
        {showMore ? "Show Less" : "Show More"}
      </button>
    </>
  );
};

const RequestButton = ({
  link,
  text,
  isInfoRequest,
  customStyle,
  icon,
  requestData = {},
}) => {
  const [showModal, setShowModal] = useState(false);
  const [responseContent, setResponseContent] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleClick = async () => {
    if (isInfoRequest) {
      try {
        // Simulate API call (going to replace with actual API call to the microservice)
        let formattedResponse;
        if (text === "Emergency Contact") {
          const response = await getEmergencyContactInfo();

          const country = user.zoneinfo;
          const emergencyContact = response.body[country];

          formattedResponse = (
            <div>
              <span>
                {country}: {emergencyContact}
              </span>
            </div>
          );
        } else {
          const moreInfo = await moreInformation(requestData);
          if (moreInfo.length <= 500) {
            formattedResponse = <Markdown>{moreInfo}</Markdown>;
          } else {
            formattedResponse = (
              <ExpandableMarkdown>{moreInfo}</ExpandableMarkdown>
            );
          }
        }

        // Set the response text
        setResponseContent(formattedResponse);
        // Show the modal
        setShowModal(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        setResponseContent(
          <p>An error occurred while fetching the information.</p>,
        );
        setShowModal(true);
      }
    } else {
      // Navigate to the provided link
      navigate(link);
    }
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

  return (
    <>
      <button
        onClick={handleClick}
        className={`${customStyle} h-12 flex items-center justify-center sm:justify-center lg:justify-start`}
      >
        <span>{getIcon()}</span>
        <span className="hidden lg:inline">{text}</span>
      </button>

      {isInfoRequest && (
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          {responseContent}
        </Modal>
      )}
    </>
  );
};

export default RequestButton;
