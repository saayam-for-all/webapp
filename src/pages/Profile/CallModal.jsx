import React, { useState, useEffect, useRef } from "react";
import {
  FiPhoneCall,
  FiVideo,
  FiMic,
  FiMicOff,
  FiVideoOff,
} from "react-icons/fi";

const CallModal = ({ isOpen, onClose, callType }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      startMedia();
    } else {
      stopMedia();
    }
  }, [isOpen]);

  const startMedia = async () => {
    try {
      const mediaConstraints = {
        audio: true,
        video: callType === "video",
      };

      const mediaStream =
        await navigator.mediaDevices.getUserMedia(mediaConstraints);
      setStream(mediaStream);

      if (videoRef.current && callType === "video") {
        videoRef.current.srcObject = mediaStream;
        try {
          await videoRef.current.play();
        } catch (err) {
          console.error("Error playing initial video:", err);
        }
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Could not access camera/microphone. Please check permissions.");
    }
  };

  const stopMedia = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  // Toggle audio mute state
  const toggleMute = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = async () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.stop();
        stream.removeTrack(track);
      });

      if (!isVideoOn) {
        // If turning video back on
        try {
          // Get new video stream
          const newVideoStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });

          // Get the new video track
          const newVideoTrack = newVideoStream.getVideoTracks()[0];

          // Add the new track to the existing stream
          stream.addTrack(newVideoTrack);

          // Update video element
          if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.srcObject = stream;
            try {
              await videoRef.current.play();
            } catch (err) {
              console.error("Error playing video after toggle:", err);
            }
          }
        } catch (error) {
          console.error("Error restarting video:", error);
          return;
        }
      }

      setIsVideoOn(!isVideoOn);
    }
  };

  // Don't render if modal is not open
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

        {/* Video Preview */}
        {callType === "video" && (
          <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        {/* Media Controls */}
        <div className="flex justify-around mb-6">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
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

          {/* Video Toggle Button */}
          {callType === "video" && (
            <button
              onClick={toggleVideo}
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
          )}
        </div>

        {/* Action Buttons */}
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          onClick={() => {
            console.log("Call started with settings:", {
              isMuted,
              isVideoOn,
              stream,
            });
            onClose();
          }}
        >
          Start Call
        </button>

        <button
          className="w-full mt-3 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition-colors"
          onClick={() => {
            stopMedia(); // Clean up media before closing
            onClose();
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CallModal;
