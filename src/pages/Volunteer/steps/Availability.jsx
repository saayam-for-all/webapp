import React from "react";
import { useState } from "react";

const CalamityCheckBox = () => {
  const [isChecked, setIsChecked] = useState(false);

  // Handle checkbox change
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle the checked state
  };

  return (
    <div className="flex items-center mb-2">
        <input
          type="checkbox"
          id="calamitybox"
          className="h-4 w-4 mr-2"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="calamitybox" className="font-medium">Would you like to receive notifications in case of emergencies or critical situations?</label>
    </div>
  );
};

const TimeZoneSelect = () => {
  const [timeZone, setTimeZone] = useState("+00:00");

  const timeZones = [{ value: "-12:00", displayStr: "(GMT/UTC - 12:00) Eniwetok, Kwajalein" },
  { value: "-11:00", displayStr: "(GMT/UTC - 11:00) Midway Island, Samoa" },
  { value: "-10:00", displayStr: "(GMT/UTC - 10:00) Hawaii" },
  { value: "-09:50", displayStr: "(GMT/UTC - 9:30) Taiohae" },
  { value: "-09:00", displayStr: "(GMT/UTC - 9:00) Alaska" },
  { value: "-08:00", displayStr: "(GMT/UTC - 8:00) Pacific Time (US & Canada)" },
  { value: "-07:00", displayStr: "(GMT/UTC - 7:00) Mountain Time (US & Canada)" },
  { value: "-06:00", displayStr: "(GMT/UTC - 6:00) Central Time (US & Canada), Mexico City" },
  { value: "-05:00", displayStr: "(GMT/UTC - 5:00) Eastern Time (US & Canada), Bogota, Lima" },
  { value: "-04:50", displayStr: "(GMT/UTC - 4:30) Caracas" },
  { value: "-04:00", displayStr: "(GMT/UTC - 4:00) Atlantic Time (Canada), Caracas, La Paz" },
  { value: "-03:50", displayStr: "(GMT/UTC - 3:30) Newfoundland" },
  { value: "-03:00", displayStr: "(GMT/UTC - 3:00) Brazil, Buenos Aires, Georgetown" },
  { value: "-02:00", displayStr: "(GMT/UTC - 2:00) Mid-Atlantic" },
  { value: "-01:00", displayStr: "(GMT/UTC - 1:00) Azores, Cape Verde Islands" },
  { value: "+00:00", displayStr: "(GMT) Western Europe Time, London, Lisbon, Casablanca" },
  { value: "+01:00", displayStr: "(GMT/UTC + 1:00) Brussels, Copenhagen, Madrid, Paris" },
  { value: "+02:00", displayStr: "(GMT/UTC + 2:00) Kaliningrad, South Africa" },
  { value: "+03:00", displayStr: "(GMT/UTC + 3:00) Baghdad, Riyadh, Moscow, St. Petersburg" },
  { value: "+03:50", displayStr: "(GMT/UTC + 3:30) Tehran" },
  { value: "+04:00", displayStr: "(GMT/UTC + 4:00) Abu Dhabi, Muscat, Baku, Tbilisi" },
  { value: "+04:50", displayStr: "(GMT/UTC + 4:30) Kabul" },
  { value: "+05:00", displayStr: "(GMT/UTC + 5:00) Ekaterinburg, Islamabad, Karachi, Tashkent" },
  { value: "+05:50", displayStr: "(GMT/UTC + 5:30) Bombay, Calcutta, Madras, New Delhi" },
  { value: "+05:75", displayStr: "(GMT/UTC + 5:45) Kathmandu, Pokhara" },
  { value: "+06:00", displayStr: "(GMT/UTC + 6:00) Almaty, Dhaka, Colombo" },
  { value: "+06:50", displayStr: "(GMT/UTC + 6:30) Yangon, Mandalay" },
  { value: "+07:00", displayStr: "(GMT/UTC + 7:00) Bangkok, Hanoi, Jakarta" },
  { value: "+08:00", displayStr: "(GMT/UTC + 8:00) Beijing, Perth, Singapore, Hong Kong" },
  { value: "+08:75", displayStr: "(GMT/UTC + 8:45) Eucla" },
  { value: "+09:00", displayStr: "(GMT/UTC + 9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk" },
  { value: "+09:50", displayStr: "(GMT/UTC + 9:30) Adelaide, Darwin" },
  { value: "+10:00", displayStr: "(GMT/UTC + 10:00) Eastern Australia, Guam, Vladivostok" },
  { value: "+10:50", displayStr: "(GMT/UTC + 10:30) Lord Howe Island" },
  { value: "+11:00", displayStr: "(GMT/UTC + 11:00) Magadan, Solomon Islands, New Caledonia" },
  { value: "+11:50", displayStr: "(GMT/UTC + 11:30) Norfolk Island" },
  { value: "+12:00", displayStr: "(GMT/UTC + 12:00) Auckland, Wellington, Fiji, Kamchatka" },
  { value: "+12:75", displayStr: "(GMT/UTC + 12:45) Chatham Islands" },
  { value: "+13:00", displayStr: "(GMT/UTC + 13:00) Apia, Nukualofa" },
  { value: "+14:00", displayStr: "(GMT/UTC + 14:00) Line Islands, Tokelau" }];
  return (
    <div className="mb-4">
      <label htmlFor="timezone" className="font-medium">Time Zone: </label>
      <select className="border border-gray-300 rounded-md p-2" id="timezone" value={timeZone} onChange={(e) => (setTimeZone(e.target.value))}>
        {timeZones.map((timeZone) => (
          <option key={timeZone.value} value={timeZone.value}>{timeZone.displayStr}</option>
        ))}
      </select>
    </div>
  )
}
const TimeInputComponent = ({ index, day, startTime, endTime, onDayChange, onTimeChange, onRemove }) => {
  const days = ['Everyday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleDayChange = (e) => {
    const newDay = e.target.value;
    onDayChange(index, newDay);
  };

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    onTimeChange(index, 'startTime', newStartTime);
  };

  const handleEndTimeChange = (e) => {
    const newEndTime = e.target.value;
    onTimeChange(index, 'endTime', newEndTime);
  };

  return (
    <div className="flex items-center space-x-4 mb-1">
      <select className="h-10 w-40 border border-gray-300 rounded-md p-2" value={day} onChange={handleDayChange}>
        <option value="">Select a day</option>
        {days.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <input className="h-10 w-40 border border-gray-300 rounded-md p-2"
        aria-label="Time"
        type="time"
        value={startTime}
        onChange={handleStartTimeChange}
      />
      <input className="h-10 w-40 border border-gray-300 rounded-md p-2"
        type="time"
        value={endTime}
        onChange={handleEndTimeChange}
      />
      <button className="border border-red-500 rounded-full hover:bg-red-100" onClick={() => onRemove(index)}>
        <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
          <path fill="#F44336" d="M21.5 4.5H26.501V43.5H21.5z" transform="rotate(45.001 24 24)"></path>
          <path fill="#F44336" d="M21.5 4.5H26.5V43.501H21.5z" transform="rotate(135.008 24 24)"></path>
        </svg>
      </button>
    </div>
  );
};

const TimeInputList = () => {
  // Initializing state with 5 TimeInputComponents
  const [components, setComponents] = useState(
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      day: '',
      startTime: '',
      endTime: ''
    }))
  );

  const handleDayChange = (index, day) => {
    console.log(`Day change at index ${index}: ${day}`);
    const newComponents = components.map((component, i) =>
      i === index ? { ...component, day } : component
    );
    setComponents(newComponents);
  };

  const handleTimeChange = (index, type, value) => {
    console.log(`Time change at index ${index} for ${type}: ${value}`);
    const newComponents = components.map((component, i) =>
      i === index ? { ...component, [type]: value } : component
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
    const newId = components.length > 0 ? components[components.length - 1].id + 1 : 0;
    setComponents([...components, {
      id: newId,
      day: '',
      startTime: '',
      endTime: ''
    }]);
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
      <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 border border-gray-300 rounded-md" onClick={handleAddComponent}>
        <svg className="w-6 h-6 inline-block pr-1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 512 512">
          <path fill="#32BEA6" d="M7.9,256C7.9,119,119,7.9,256,7.9C393,7.9,504.1,119,504.1,256c0,137-111.1,248.1-248.1,248.1C119,504.1,7.9,393,7.9,256z"></path>
          <path fill="#FFF" d="M391.5,214.5H297v-93.9c0-4-3.2-7.2-7.2-7.2h-68.1c-4,0-7.2,3.2-7.2,7.2v93.9h-93.9c-4,0-7.2,3.2-7.2,7.2v69.2c0,4,3.2,7.2,7.2,7.2h93.9v93.4c0,4,3.2,7.2,7.2,7.2h68.1c4,0,7.2-3.2,7.2-7.2v-93.4h94.5c4,0,7.2-3.2,7.2-7.2v-69.2C398.7,217.7,395.4,214.5,391.5,214.5z"></path>
        </svg>
        Add
      </button>
    </div>
  );
};

const Availability = () => {
  return <div>
    <p className="font-bold text-xl text-center underline mb-4">Please Provide Your Available Time Slots for Volunteering</p>
    <CalamityCheckBox />
    <TimeZoneSelect />
    <TimeInputList />
  </div>;
};

export default Availability;
