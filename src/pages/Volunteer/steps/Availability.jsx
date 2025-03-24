import React from "react";
import { useState } from "react";
import { TimePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";

const TimeInputComponent = ({
  index,
  day,
  startTime,
  endTime,
  onDayChange,
  onTimeChange,
  onRemove,
}) => {
  const days = [
    "Everyday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleDayChange = (e) => {
    const newDay = e.target.value;
    onDayChange(index, newDay);
  };

  const handleStartTimeChange = (newStartTime) => {
    onTimeChange(index, "startTime", newStartTime);
  };

  const handleEndTimeChange = (newEndTime) => {
    onTimeChange(index, "endTime", newEndTime);
  };

  return (
    <div className="flex items-center space-x-4 mb-1">
      <select
        className="w-40 border border-gray-300 rounded-md p-2"
        value={day}
        onChange={handleDayChange}
      >
        {days.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <TimePicker
        className="rounded-md w-40"
        // value={startTime}
        onChange={handleStartTimeChange}
        onOk={handleStartTimeChange}
        disableClock={true}
        format="hh:mm a"
        hourPlaceholder="hh"
        minutePlaceholder="mm"
        clearIcon={null}
      />
      <TimePicker
        className="rounded-md  w-40"
        value={endTime}
        onChange={handleEndTimeChange}
        onOk={handleEndTimeChange}
        disableClock={false}
        format="hh:mm a"
        hourPlaceholder="hh"
        minutePlaceholder="mm"
        clearIcon={null}
      />
      <button
        className="border border-red-500 rounded-full hover:bg-red-100"
        onClick={() => onRemove(index)}
      >
        <svg
          className="w-3 h-3"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="100"
          height="100"
          viewBox="0 0 48 48"
        >
          <path
            fill="#F44336"
            d="M21.5 4.5H26.501V43.5H21.5z"
            transform="rotate(45.001 24 24)"
          ></path>
          <path
            fill="#F44336"
            d="M21.5 4.5H26.5V43.501H21.5z"
            transform="rotate(135.008 24 24)"
          ></path>
        </svg>
      </button>
    </div>
  );
};

const TimeInputList = ({ components, setComponents }) => {
  // Initializing state with 5 TimeInputComponents
  // const [components, setComponents] = useState(
  //   Array.from({ length: 1 }, (_, i) => ({
  //     id: i,
  //     day: "Everyday",
  //     startTime: "00:00",
  //     endTime: "00:00",
  //   })),
  // );

  const handleDayChange = (index, day) => {
    console.log(`Day change at index ${index}: ${day}`);
    const newComponents = components.map((component, i) =>
      i === index ? { ...component, day } : component,
    );
    setComponents(newComponents);
  };

  const handleTimeChange = (index, type, value) => {
    console.log(`Time change at index ${index} for ${type}: ${value}`);
    const newComponents = components.map((component, i) =>
      i === index ? { ...component, [type]: value } : component,
    );
    setComponents(newComponents);
  };

  const handleRemoveComponent = (index) => {
    console.log(`Removing component at index ${index}`);
    // Ensure at least one component remains
    if (components.length > 1) {
      const newComponents = components.filter((_, i) => i !== index);
      setComponents(newComponents);
    }
  };

  const handleAddComponent = () => {
    const newId =
      components.length > 0 ? components[components.length - 1].id + 1 : 0;
    setComponents([
      ...components,
      {
        id: newId,
        day: "Everyday",
        startTime: "00:00",
        endTime: "00:00",
      },
    ]);
    console.log(`components: ${JSON.stringify(components)}`);
  };

  return (
    <div>
      {components.map((component, index) => (
        <TimeInputComponent
          key={component.id}
          index={index}
          day={component.day}
          startTime={component.startTime}
          endTime={component.endTime}
          onDayChange={handleDayChange}
          onTimeChange={handleTimeChange}
          onRemove={handleRemoveComponent}
        />
      ))}
      <button
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 border border-gray-300 rounded-md mt-2"
        onClick={handleAddComponent}
      >
        <svg
          className="w-6 h-6 inline-block pr-1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="100"
          height="100"
          viewBox="0 0 512 512"
        >
          <path
            fill="#32BEA6"
            d="M7.9,256C7.9,119,119,7.9,256,7.9C393,7.9,504.1,119,504.1,256c0,137-111.1,248.1-248.1,248.1C119,504.1,7.9,393,7.9,256z"
          ></path>
          <path
            fill="#FFF"
            d="M391.5,214.5H297v-93.9c0-4-3.2-7.2-7.2-7.2h-68.1c-4,0-7.2,3.2-7.2,7.2v93.9h-93.9c-4,0-7.2,3.2-7.2,7.2v69.2c0,4,3.2,7.2,7.2,7.2h93.9v93.4c0,4,3.2,7.2,7.2,7.2h68.1c4,0,7.2-3.2,7.2-7.2v-93.4h94.5c4,0,7.2-3.2,7.2-7.2v-69.2C398.7,217.7,395.4,214.5,391.5,214.5z"
          ></path>
        </svg>
        Add
      </button>
    </div>
  );
};

const Availability = ({
  availabilitySlots,
  tobeNotified,
  setAvailabilitySlots,
  setNotification,
}) => {
  const handleCheckboxChange = () => {
    setNotification((tobeNotified) => !tobeNotified);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="font-bold text-xl mb-4">
        Please Provide Your Available Time Slots for Volunteering
      </p>
      <TimeInputList
        components={availabilitySlots}
        setComponents={setAvailabilitySlots}
      />
      <div className="flex items-center mt-6 mb-2">
        <input
          type="checkbox"
          id="calamitybox"
          className="h-4 w-4 mr-2"
          checked={tobeNotified}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="tobeNotified" className="font-medium">
          Would you like to receive notifications in case of emergencies or
          critical situations?
        </label>
      </div>
    </div>
  );
};

export default Availability;
