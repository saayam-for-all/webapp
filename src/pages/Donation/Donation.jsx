

import React, { useState } from 'react';
import './Donation.css'; // Add your CSS styles in this file

export default function Donation() {
  const [donationAmount, setDonationAmount] = useState(10);

  const handleInputChange = (e) => {
    setDonationAmount(e.target.value);
  };

  return (
    <div className="donation-tab">
      <h2>Support a Cause</h2>
      <p>Help us make the world a better place.</p>
      <div className="donation-input">
        <span>$</span>
        <input
          type="number"
          value={donationAmount}
          onChange={handleInputChange}
          min="1"
        />
      </div>
      <button>Donate Now</button>
    </div>
  );
};


