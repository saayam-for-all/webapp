const howWeOperateData = [
  {
    heading: "1. New user registration",
    points: [
      "User opens the Saayam app either on his phone or on his laptop.",
      "Main page contains some generic info about our org, Founder and board member details and contact info. It can be a simple static page with proper links from the top level menu bar.",
      "Top level menu bar contains options - About, Team, Contact, Donate, Login/Register.",
      "New user would click on the Login/Register option.",
      "We show various login options - userid/password and social media login options like Facebook, Google etc.",
      "We also show a message saying that if you are NOT YET registered with us, please register yourself. Here, Register will be a link in the message.",
      "As part of registration, we will be collecting first name, last name, email address, phone number, contact address etc. from the user. Phone number and/or email are MUST HAVE fields.",
      "Once a user submits this basic information, we will send a confirmation text or email to his phone or email id. Until the user verifies the registration, this user will be in “New” state.",
      "Once the user confirms the registration, this user would be able to login into our system subsequently. This user state will be changed “Verified”.",
      "A verified user can submit requests for help for himself/herself or for somebody else. But this user cannot be assigned any requests until this user completes all the formalities of training.",
      "Implementation would be based in on AWS Cognito. Once a user is verified, Cognito will invoke a Lambda function to register this user with our database.",
    ],
  },
  {
    heading: "2. Registered user login",
    points: [
      "User clicks on the Login/Register option on our app.",
      "We show a login screen to collect user credentials.",
      "When a user logs in, the content we show on the home page depends on the user’s state.",
      "The top menu bar now shows the picture of the logged in user if the user uploads his/her pic. If not, we can show a generic image. This is a clickable image that brings up a drop down with a few menu options:",
      [
        "First name and last name of the logged in user.",
        "Settings - TBD This can include the upload option for his/her pic User should be able to edit his information that was originally submitted. If he changes his phone number or email id, then we need to verify that info again with MFA.",
        "Logout to end his session.",
      ],
      "If user is a",
      [
        "Verified User: This user can see the status of the requests he/she made, make a new help request and also opt for becoming a volunteer. We can show the help requests this user has created for himself/herself in one table. In another table we show the requests he/she has created for others. Each row in these tables will have * Request ID: Each request will have a unique id that acts as a link to drill down into a page to show more details about this request. * Request Type * Subject: Brief details or subject of the request * Creation Date * Closed Date - if it is closed. * We also show a button to create a New Help request right below the main menu bar. * We also show an option to become a certified volunteer.",
        "Certified Volunteer: This user has completed all formalities to become a volunteer. In addition to the above two tables that are shown for a Verified User, we will show another table that this volunteer is managing. For this volunteer we show only the Create Help Request option. No need to show Become a Volunteer button.",
      ],
    ],
  },
  {
    heading: "3. Request for help",
    points: [
      "Any logged in user can create a request for help either for himself/herself or for somebody else.",
      "User clicks on the Create Request button after login. System shows a form to enter request details.",
      "We need to show a Warning in this page - If this is a life threatening matter, please contact local authorities. We cannot handle emergency matters.",
      "We need to ask whether this request is for himself/herself. If this is for somebody else, we need to show a few additional fields to collect the first name, last name, address, phone number and email of the requestor. All these fields will be optional as some of the requestors may not have a phone or email. This information is for contacting the requestor directly if needed. This requestor is NOT a user of our system.",
      "We may have to come up with some types of requests in a drop down. There will always be a Generic type option if the user cannot decide the right type.",
      "User enters brief details of the help needed in a Text Field. Though we start with the English language initially, based on logged in user’s profile, this language choice would change to his local/preferred language.",
      "We can collect expected response time - hours/day etc. Based on this we can prioritize this request. Language preference if any",
      "User submits the request.",
      "System should register this request and send back an acknowledgement to the requestor saying a volunteer would contact him/her asap.",
      "Match the request with a volunteer",
      "Once request is received, our system matches a volunteer based on following criteria",
      [
        "Request type and content - profile match.",
        "Proximity - location match",
        "Language Match",
      ],
      "Pick a subset of matched volunteers and send notifications. If we have too many volunteers in that neighborhood, alerting all may not be a good option.",
      "If any volunteer from this list accepts the request, this case would be assigned to that volunteer. If no volunteer picks up the case, we may need to escalate the process by finding the next set of volunteers or fallback on a volunteer org or govt. Org eventually. Inform the requester about the volunteer info and create a separate workflow for this case.",
      "We need to generate a One Time Password/Token (OTP) that will be informed to the requester and to the assigned volunteer.",
      "When the volunteer approaches/contacts the requestor, the requester needs to verify the volunteer with this OTP.",
      "After the initial conversation, the requestor needs to confirm that he/she will go ahead with this volunteer. If the requestor does NOT like this volunteer for any reason, requester can reject this volunteer by specifying his/her reasons. Then, we will repeat the matching process again.",
      "Once a volunteer becomes the case owner, he/she will have the privilege to update this request and handle this case.",
      "Finally the volunteer closes the case when the issue is resolved.",
      "We need to collect the feedback from the requestor and also ask the requestor to rate this volunteer.",
    ],
  },
  {
    heading: "4. Transitioning an user to a volunteer",
    points: [
      "A verified user needs to click on the button to become a volunteer. This is a multi step process.",
      [
        "Need to submit a proof - Driver license, passport, Aadhar card etc.",
        "Need to go through a training session and pass that test.",
        "Need to provide profile information. One volunteer can have multiple profiles. For e.g. an educator can also be a hiker or gardener. We need to collect profile specific questions, languages he/she can speak etc.",
      ],
      "A local volunteer - who has completed this process earlier needs to talk to this person for manual screening and also verifying the document that was submitted earlier.",
      "Once all these formalities are completed, this certifying volunteer will promote this user to a volunteer.",
      "Our system needs to record who certified what user etc. for our records.",
    ],
  },
  {
    heading: "5. Case Handling",
    points: [
      "A simple request can be handled by a single volunteer himself/herself. The mode of operation would be a phone call.",
      "If the requester agrees to meet the volunteer, then this volunteer can go to the requestor if it is close by.",
      "For any reason, if this request cannot be handled by a single volunteer, this volunteer can escalate this request. This escalation can be done from the request details page.",
      "Escalation process needs to identify how many more volunteers are needed to handle this case, This will trigger one or more match making requests. As a team, these volunteers need to resolve this case. Request details page needs to show all the names of the other volunteers that are working on this request.",
      "If the volunteer decides that this requestor needs to be taken to a volunteer organization, then this volunteer needs to find the matching volunteer organization. This option will be available from the Request Details page. This volunteer is responsible until the volunteer org takes full responsibility of this requestor.",
      "If we cannot find a volunteer org also, then we should ask the requestor to go to a local authority or hospital.",
    ],
  },
  {
    heading: "6. Finding a Volunteer Organization",
    points: [
      "From the Request Details page, the volunteer needs to click a button to show various options for the organizations.",
      "Based on the type of the request and request details, our system tries to find all matching organizations and shows them in a table",
      [
        "Name of the organization",
        "Address",
        "Contact details - phone and/or email,URL",
      ],
      "The Volunteer can pick an organization in consultation with the requestor, contact this org and work with them to handle this case further.",
    ],
  },
  {
    heading: "7. Request Details Page",
    points: [
      "This page contains all the details of a specific request",
      [
        "Who created this request - self/for somebody else",
        "Type of request",
        "When it was create",
        "What is its current status",
      ],
      "A button for Escalation flow - shown to volunteers/case owners only. Basic users cannot see this button.",
      "A button for searching for Volunteer organizations. Visible to only volunteers/case owners.",
    ],
  },
  {
    heading: "8. Administrative Information",
    points: [
      "We need a few views/pages to look at",
      [
        "Currently registered users",
        "Users that are transitioning to volunteers",
        "Currently available volunteers",
        "Pending requests that need to be resolved",
        "Closed requests",
      ],
      "TBD - who will get this administrative privilege to see above information.",
    ],
  },
  {
    heading: "9. Donations",
    points: [
      "This is an independent operation from the top menu bar.",
      "A non-registered user also can donate.",
      "By clicking on the Donate button, we can bring up a page that contains information that is required by our integrator. If an already logged in user clicks this Donate button, if we can pre populate the user info in the Donate page, that would be helpful. Otherwise, the new user needs to enter all required info.",
      "We should allow a one time donation and also recurring donation using all popular methods - credit card, ACH, PayPal etc.",
      "Need to send confirmation/acknowledgment after the transaction.",
    ],
  },
  {
    heading: "10. End to End Use case for request handling (Backened Use Case)",
    points: [
      "A help request is raised from our app (web/mobile) either by the person in need or by a member/volunteer on behalf of the needy person.",
      "This request goes to the API Gateway. Gets authenticated by Cognito. Then API Gateway invokes a Lambda function to make a call on Requester micro service.",
      "Requester micro service starts a Step Function (work flow) for every request after creating an entry for this request in the DB. This step function is responsible for the entire CRUD operations for this request. Request ID will be a unique This is how each Request workflow works:",
      [
        "Makes a request on Requester micro service to find suitable volunteers by doing profile matching.",
        "Finds a few volunteers",
        [
          "sends notifications to volunteers in batches. Requests SNS to send this notification.",
          "waits for a specified time for at least one volunteer to accept this request.",
          "If a volunteer accepts this request, this volunteer becomes the Request Owner (a Uber Driver)",
          "If first batch of volunteers do NOT respond, notifications will be sent to next batch of volunteers. This way we continue until we run out of matched volunteers.",
          "If no matched volunteer,",
        ],
        "Does NOT find any volunteers",
      ],
      "Requester micro service tries to do profile matching to find a few suitable volunteers. TBD - logic to find the volunteers.",
      "Requester micro service creates a Step Function (Work flow) for this specific request.",
    ],
  },
];

export default howWeOperateData;
