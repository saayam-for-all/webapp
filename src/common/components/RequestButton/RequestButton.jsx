import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import { MdContactPhone } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";



const RequestButton = ({ link, text, isInfoRequest , customStyle, icon  }) => {
  const [showModal, setShowModal] = useState(false);
  const [responseContent, setResponseContent] = useState(null);
  const navigate = useNavigate();

  const handleClick = async() => {
    if (isInfoRequest) {
        try {

            // Simulate API call (going to replace with actual API call to the microservice)
            const formattedResponse = (
                <div>
                  <p><strong>Additional Information About the Community Clean-Up Event:</strong></p>
                  <p>The <strong>Community Clean-Up Day</strong> scheduled for <strong>August 15, 2024</strong> at Cherry Creek Park is a vital initiative aimed at promoting environmental responsibility and community engagement. Participants will help make the park cleaner by engaging in the following tasks:</p>
                  <ul className="list-disc pl-5">
                    <li><strong>Picking up litter:</strong> Volunteers will walk through designated areas of the park to collect trash, helping to beautify the space and prevent pollution.</li>
                    <li><strong>Sorting recyclables:</strong> Volunteers will assist in separating recyclables from general waste, contributing to a sustainable waste management system.</li>
                    <li><strong>Managing the registration table:</strong> Some volunteers will be responsible for welcoming participants, distributing materials, and keeping track of sign-ins.</li>
                  </ul>
                  <p>In addition to volunteer efforts, we are actively seeking donations of supplies to ensure the event runs smoothly. Specifically, we are looking for:</p>
                  <ul className="list-disc pl-5">
                    <li><strong>Trash bags:</strong> To collect litter and recyclables.</li>
                    <li><strong>Gloves:</strong> For the safety and comfort of volunteers during clean-up.</li>
                    <li><strong>Refreshments:</strong> To provide water and snacks to keep participants energized throughout the event.</li>
                  </ul>
                  <p>This event is an excellent opportunity to meet other community members, contribute to a cleaner environment, and make a positive impact. Whether you’re volunteering your time or donating supplies, your support is crucial to making Cherry Creek Park a cleaner and more enjoyable place for everyone.</p>
                </div>
            );

            // Set the response text
            setResponseContent(formattedResponse);
            // Show the modal
            setShowModal(true);
        } catch(error){
            console.error("Error fetching data:", error);
            setResponseContent(<p>An error occurred while fetching the information.</p>);
            setShowModal(true);
        }
    } else {
        // Navigate to the provided link
        navigate(link);
    }
  }

  const getIcon = () => {
    switch (icon) {
      case "i-info":
        return <FaInfoCircle size={30}/>;
      case "i-volunteer":
        return <FaPeopleGroup size={30} />;
      case "i-emergency":
        return <MdContactPhone size={30} />;
      default:
        return null;
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`${customStyle} flex items-center justify-center sm:justify-center lg:justify-start space-x-2 transition ease-in-out duration-300 px-3 py-2 md:px-6 md:py-3`}
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