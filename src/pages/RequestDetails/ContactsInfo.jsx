import React, { useState } from "react";
import { IoIosVideocam, IoIosCall } from "react-icons/io";

const CantactsInfo = ({ onVideoClick, onCallClick }) => {

  return (
    <div className="absolute p-2 bg-white border shadow-lg rounded-lg flex space-x-4">
      <IoIosVideocam
        size={18}
        onClick={(event) => {
          event.stopPropagation();
          console.log("Video Call");
        }}
      />
      <IoIosCall
        size={18}
        onClick={(event) => {
          event.stopPropagation();
            console.log("Audio Call");
        }}
      />
    </div>
  );
};

export default CantactsInfo;
