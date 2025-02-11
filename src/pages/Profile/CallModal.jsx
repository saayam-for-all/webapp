import React, { useState } from "react";
import { FiPhoneCall, FiVideo, FiMic, FiMicOff, FiVideoOff } from "react-icons/fi";

const CallModal = ({ isOpen, onClose, callType }) => {
  const [isMuted, setIsMuted] = useState(false); 
  const [isVideoOn, setIsVideoOn] = useState(true); 

  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {/* Modal Header */}
        <h2 className="text-xl font-bold mb-4">
          {callType === "audio" ? (
            <div className="flex items-center space-x-2">
              <FiPhoneCall className="text-blue-500" />
              <span>Audio Call</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <FiVideo className="text-blue-500" />
              <span>Video Call</span>
            </div>
          )}
        </h2>

        {/* Audio and Video Toggle Buttons */}
        <div className="flex justify-around mb-6">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex flex-col items-center p-3 rounded-lg ${
              isMuted ? "bg-red-100" : "bg-gray-100"
            } hover:bg-gray-200 transition-colors`}
          >
            {isMuted ? (
              <FiMicOff className="text-red-500 text-2xl" />
            ) : (
              <FiMic className="text-green-500 text-2xl" />
            )}
            <span className="text-sm mt-1">{isMuted ? "Unmute" : "Mute"}</span>
          </button>

          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`flex flex-col items-center p-3 rounded-lg ${
              !isVideoOn ? "bg-red-100" : "bg-gray-100"
            } hover:bg-gray-200 transition-colors`}
          >
            {isVideoOn ? (
              <FiVideo className="text-green-500 text-2xl" />
            ) : (
              <FiVideoOff className="text-red-500 text-2xl" />
            )}
            <span className="text-sm mt-1">
              {isVideoOn ? "Turn Off Video" : "Turn On Video"}
            </span>
          </button>
        </div>

        {/* Start Call Button */}
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          onClick={() => {
            console.log("Call started with settings:", {
              isMuted,
              isVideoOn,
            });
            onClose(); 
          }}
        >
          Start Call
        </button>

        {/* Close Button */}
        <button
          className="w-full mt-3 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition-colors"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CallModal;