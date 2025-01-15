import React, { useState, useEffect, useRef } from "react";

const TermsConditions = ({ isAcknowledged, setIsAcknowledged }) => {
  const [isCheckboxEnabled, setIsCheckboxEnabled] = useState(false);
  const scrollBoxRef = useRef(null);

  const handleCheckboxChange = () => {
    setIsAcknowledged(!isAcknowledged);
  };

  const handleScroll = () => {
    const scrollBox = scrollBoxRef.current;
    if (scrollBox.scrollTop + scrollBox.clientHeight >= scrollBox.scrollHeight) {
      setIsCheckboxEnabled(true);
    } else {
      setIsCheckboxEnabled(false);
    }
  };

  useEffect(() => {
    const scrollBox = scrollBoxRef.current;
    if (scrollBox) {
      scrollBox.addEventListener("scroll", handleScroll);
      return () => scrollBox.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className="document-acknowledgment p-6">
      <h2 className="text-2xl font-bold mb-4">Review & Acknowledge Terms</h2>
      <p className="mb-4">
        Please read the following document carefully and acknowledge that you
        have understood its contents.
      </p>
      {/* <a
        // href="/path-to-your-document.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        View Document (PDF)
      </a> */}
      <div
        ref={scrollBoxRef}
        className="scrolling-box mt-4 mb-4 p-4 border border-gray-300"
        style={{ height: '150px', overflowY: 'auto' }}
      >
        <h3 className="font-bold text-lg mb-2">Volunteer Agreement for Saayam for All</h3>
        <p>
        <h4 className="font-bold text-lg mb-2">1. Introduction<br/></h4>
          This Volunteer Agreement ("Agreement") is entered into between Saayam for All ("Organization") and the 
          volunteer ("Volunteer") upon acceptance. By signing or agreeing electronically, the Volunteer 
          acknowledges their understanding and acceptance of the terms herein, which govern their participation 
          in any volunteer activities with the Organization.<br/>

          <h4 className="font-bold text-lg mb-2">2. Volunteer Role and Responsibilities<br/></h4>
          The Volunteer agrees to fulfill the roles and responsibilities assigned by the Organization, which may 
          include, but are not limited to, assisting in various tasks as needed by individuals or communities 
          requesting help. The Volunteer agrees to: <br/>
          - Engage in activities assigned by the Organization in a diligent, responsible, and professional manner. <br/>
          - Communicate promptly with the Organization regarding availability, progress, and challenges. <br/>
          - Complete assigned tasks promptly and to the best of their ability, adhering to any specified deadlines.<br/>

          <h4 className="font-bold text-lg mb-2">3. Code of Conduct<br/></h4>
          The Volunteer agrees to maintain the highest standards of ethical behavior while representing the 
          Organization. This includes: <br/>
          - Treating all individuals with respect and dignity, regardless of race, religion, gender, sexual orientation, 
          age, or disability. <br/>
          - Refraining from any form of discrimination, harassment, or unprofessional behavior. <br/>
          - Avoiding conflicts of interest and ensuring that personal interests do not interfere with their volunteer 
          duties. <br/>

          <h4 className="font-bold text-lg mb-2">4. Confidentiality Agreement<br/></h4>
          The Volunteer acknowledges that during their service, they may be privy to confidential, proprietary, or 
          personal information relating to the Organization, other volunteers, or individuals seeking assistance. The 
          Volunteer agrees to: <br/>
          - Maintain confidentiality of all information, both during & after the term of this Agreement. <br/>
          - Use such information solely for the purpose of fulfilling their volunteer responsibilities. <br/>
          - Not disclose any confidential information to third parties without the explicit written consent of the 
          Organization. <br/>

          <h4 className="font-bold text-lg mb-2">5. Data Protection and Privacy<br/></h4>
          The Volunteer agrees to comply with all applicable data protection laws and regulations, including but not 
          limited to the General Data Protection Regulation (GDPR) or any other local data protection laws. The 
          Volunteer agrees to: <br/>
          - Handle all personal data in accordance with the Organization’s data protection policies. <br/>
          - Protect the integrity and confidentiality of any personal data accessed during volunteer activities. <br/>
          - Immediately report any data breaches or incidents of unauthorized access to the Organization. <br/>

          <h4 className="font-bold text-lg mb-2">6. Intellectual Property<br/></h4>
          Any work, materials, or intellectual property created by the Volunteer in the course of their volunteer 
          activities shall be the sole property of the Organization. The Volunteer agrees to: <br/>
          - Assign all rights, titles, and interests in such intellectual property to the Organization. <br/>
          - Refrain from using, reproducing, or distributing any intellectual property created during their service 
          without the Organization's explicit consent. <br/>

          <h4 className="font-bold text-lg mb-2">7. Liability Waiver and Assumption of Risk<br/></h4>
          The Volunteer acknowledges that participation in volunteer activities may involve inherent risks, including 
          but not limited to physical injury, emotional distress, or property damage. The Volunteer agrees to: <br/>
          - Assume all risks associated with their volunteer activities, including any travel or transportation risks. <br/>
          - Release, waive, and discharge the Organization, its officers, directors, employees, and affiliates from any 
          and all liability, claims, or demands arising out of or relating to their volunteer activities. <br/>
          - Acknowledge that the Organization does not provide insurance coverage for volunteers, and the 
          Volunteer is responsible for obtaining any necessary insurance. <br/>

          <h4 className="font-bold text-lg mb-2">8. Indemnification<br/></h4>
          The Volunteer agrees to indemnify and hold harmless the Organization, its officers, directors, employees, 
          and affiliates from and against any and all claims, damages, losses, liabilities, costs, and expenses 
          (including legal fees) arising out of or related to the Volunteer’s actions or omissions during their service. <br/>

          <h4 className="font-bold text-lg mb-2">9. Commitment and Expectations<br/></h4>
          The Volunteer agrees to commit to the responsibilities and timeframes as communicated by the 
          Organization. If the Volunteer is unable to fulfill these commitments, they agree to: <br/>
          - Notify the Organization as soon as possible, providing a valid reason for their unavailability. <br/>
          - Work collaboratively with the Organization to ensure a smooth transition of responsibilities, if necessary. <br/>

          <h4 className="font-bold text-lg mb-2">10. Training and Supervision<br/></h4>
          The Organization will provide necessary training and supervision to the Volunteer. The Volunteer agrees 
          to: <br/>
          - Attend all required training sessions. <br/>
          - Adhere to instructions and guidelines provided by the Organization’s supervisors or staff. <br/>
          - Seek clarification or assistance when needed to perform their duties effectively. <br/>

          <h4 className="font-bold text-lg mb-2">11. Health and Safety<br/></h4>
          The Volunteer acknowledges their responsibility to follow all health and safety guidelines provided by the 
          Organization. The Volunteer agrees to: <br/>
          - Report any unsafe conditions or incidents immediately to the Organization. <br/>
          - Take reasonable precautions to protect their health and safety as well as that of others during their 
          volunteer activities. <br/>

          <h4 className="font-bold text-lg mb-2">12. Dispute Resolution<br/></h4>
          In the event of any disputes arising out of or related to this Agreement, the parties agree to attempt to 
          resolve the matter through good faith negotiations. If a resolution cannot be reached, the parties agree to 
          submit to mediation or arbitration, as mutually agreed, before pursuing any legal action. <br/>

          <h4 className="font-bold text-lg mb-2">13. Governing Law<br/></h4>
          This Agreement shall be governed by and construed in accordance with global laws applicable to the 
          activities and interactions facilitated by the Organization. Any legal proceedings arising out of or related to 
          this Agreement shall be brought in the appropriate courts of a jurisdiction mutually agreed upon by both
          parties. <br/>

          <h4 className="font-bold text-lg mb-2">14. Acknowledgment and Consent<br/></h4>
          By agreeing to this document, the Volunteer acknowledges that they have read, understood, and 
          accepted these terms. The Volunteer agrees to abide by all the guidelines, policies, and expectations 
          outlined herein and understands that their volunteer status is contingent upon adherence to this 
          Agreement.
        </p>
      </div>
      <div className="checkbox-container mt-4">
        <input
          type="checkbox"
          id="acknowledge"
          checked={isAcknowledged}
          onChange={handleCheckboxChange}
          className="mr-2"
          disabled={!isCheckboxEnabled}
        />
        <label htmlFor="acknowledge" className="text-gray-700">
          I have read and understood the document
        </label>
      </div>
    </div>
  );
};

export default TermsConditions;
