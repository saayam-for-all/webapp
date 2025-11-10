import { useState } from "react";
import PropTypes from "prop-types";
import { TimePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";

const getDefaultSlot = () => ({
  id: Date.now() + Math.random(),
  dayOfWeek: "Everyday",
  startTime: null,
  endTime: null,
});

const TimeInputComponent = ({
  index,
  dayOfWeek,
  startTime,
  endTime,
  onDayChange,
  onTimeChange,
  onRemove,
  errors,
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

  return (
    <div className="flex items-center space-x-4 mb-1">
      <select
        className="w-40 border border-gray-300 rounded-md p-2"
        value={dayOfWeek}
        onChange={(e) => onDayChange(index, e.target.value)}
      >
        {days.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <div>
        <TimePicker
          className={`rounded-md w-40 ${errors?.startTime ? "border border-red-500" : ""}`}
          value={startTime}
          onChange={(v) => onTimeChange(index, "startTime", v)}
          format="hh:mm a"
          hourplaceholder="hh"
          minuteplaceholder="mm"
          clearicon={null}
        />
        {errors?.startTime && (
          <div className="text-xs text-red-500">Required</div>
        )}
      </div>
      <div>
        <TimePicker
          className={`rounded-md w-40 ${errors?.endTime ? "border border-red-500" : ""}`}
          value={endTime}
          onChange={(v) => onTimeChange(index, "endTime", v)}
          format="hh:mm a"
          hourplaceholder="hh"
          minuteplaceholder="mm"
          clearicon={null}
          shouldDisableHour={(hour) => {
            if (!startTime) return false;
            // Disable hours less than or equal to startTime hour
            return hour <= startTime.getHours();
          }}
          shouldDisableMinute={(minute, selectedHour) => {
            if (!startTime) return false;
            const startHour = startTime.getHours();
            const startMinute = startTime.getMinutes();
            // If selected hour is the same as startTime hour, disable minutes <= startMinute
            if (selectedHour === startHour) {
              return minute <= startMinute;
            }
            return false;
          }}
        />
        {errors?.endTime && (
          <div className="text-xs text-red-500">Required</div>
        )}
        {endTime && startTime && endTime <= startTime && (
          <div className="text-xs text-red-500">
            End time must be after start time
          </div>
        )}
      </div>
      <button
        className="ml-1 border border-red-500 rounded-full hover:bg-red-100"
        onClick={() => onRemove(index)}
        type="button"
        aria-label="Remove row"
        title="Remove row"
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

TimeInputComponent.propTypes = {
  index: PropTypes.number.isRequired,
  dayOfWeek: PropTypes.string.isRequired,
  startTime: PropTypes.instanceOf(Date),
  endTime: PropTypes.instanceOf(Date),
  onDayChange: PropTypes.func.isRequired,
  onTimeChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    startTime: PropTypes.bool,
    endTime: PropTypes.bool,
  }),
};

const TimeInputList = ({ slots, setSlots, errors, setErrors }) => {
  const handleDayChange = (index, newDay) => {
    setSlots((s) =>
      s.map((slot, i) => (i === index ? { ...slot, dayOfWeek: newDay } : slot)),
    );
  };

  const handleTimeChange = (index, which, val) => {
    setSlots((s) =>
      s.map((slot, i) => (i === index ? { ...slot, [which]: val } : slot)),
    );
    if (errors[index]?.[which]) {
      setErrors((errs) =>
        errs.map((err, i) => (i === index ? { ...err, [which]: false } : err)),
      );
    }
  };

  const validate = () => {
    const newErrors = slots.map((slot) => ({
      startTime: !slot.startTime,
      endTime: !slot.endTime,
    }));
    setErrors(newErrors);
    return newErrors.every((e) => !e.startTime && !e.endTime);
  };

  const handleRemove = (index) => {
    if (slots.length > 1) {
      setSlots((prev) => prev.filter((_, i) => i !== index));
      setErrors((prevErrs) => prevErrs.filter((_, i) => i !== index));
    }
  };

  const handleAdd = () => {
    if (validate()) {
      setSlots((prev) => [...prev, getDefaultSlot()]);
      setErrors((prev) => [...prev, { startTime: false, endTime: false }]);
    }
  };

  return (
    <div>
      {slots.map((slot, idx) => (
        <TimeInputComponent
          key={slot.id}
          index={idx}
          {...slot}
          onDayChange={handleDayChange}
          onTimeChange={handleTimeChange}
          onRemove={handleRemove}
          errors={errors[idx]}
        />
      ))}
      <button
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 border border-gray-300 rounded-md mt-2"
        onClick={handleAdd}
        type="button"
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

TimeInputList.propTypes = {
  slots: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      dayOfWeek: PropTypes.string,
      startTime: PropTypes.instanceOf(Date),
      endTime: PropTypes.instanceOf(Date),
    }),
  ).isRequired,
  setSlots: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      startTime: PropTypes.bool,
      endTime: PropTypes.bool,
    }),
  ).isRequired,
  setErrors: PropTypes.func.isRequired,
};

// ======= Availability (Main Component) =======
const Availability = ({
  availabilitySlots,
  setAvailabilitySlots,
  tobeNotified,
  setNotification,
}) => {
  const [errors, setErrors] = useState([{ startTime: false, endTime: false }]);

  const handleCheckbox = () => {
    setNotification((tobeNotified) => !tobeNotified);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="font-bold text-xl mb-4">
        Please Provide Your Available Time Slots for Volunteering
      </p>
      <TimeInputList
        slots={availabilitySlots}
        setSlots={setAvailabilitySlots}
        errors={errors}
        setErrors={setErrors}
      />
      <div className="flex items-center mt-6 mb-2">
        <input
          type="checkbox"
          id="calamitybox"
          className="h-4 w-4 mr-2"
          checked={tobeNotified}
          onChange={handleCheckbox}
        />
        <label htmlFor="tobeNotified" className="font-medium">
          Would you like to receive notifications in case of emergencies or
          critical situations?
        </label>
      </div>
    </div>
  );
};

Availability.propTypes = {
  availabilitySlots: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      dayOfWeek: PropTypes.string,
      startTime: PropTypes.instanceOf(Date),
      endTime: PropTypes.instanceOf(Date),
    }),
  ).isRequired,
  setAvailabilitySlots: PropTypes.func.isRequired,
  tobeNotified: PropTypes.bool,
  setNotification: PropTypes.func,
};

export default Availability;
