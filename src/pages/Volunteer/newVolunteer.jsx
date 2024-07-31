import React, { useState, useRef } from "react";
import "./Volunteer.css";
import { Button, Form, Tab, Tabs } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";

// https://react-bootstrap.netlify.app/docs/forms/form-control

const courseUrl = "a9__D53WsUs";

const VolunteerPage = () => {
  const [key, setKey] = useState("pii");
  const [piiComplete, setPiiComplete] = useState(false);
  const [courseComplete, setCourseComplete] = useState(false);
  const [tcComplete, setTcComplete] = useState(false);
  const [data, setData] = useState({ pii_file: "", agree: false });
  const { pii_file, agree } = data;

  const handleNext = () => {
    switch (key) {
      case "pii":
        setPiiComplete(false);
        setCourseComplete(true);
        setKey("course");
        break;
      case "course":
        setCourseComplete(false);
        setTcComplete(true);
        setKey("tc");
        break;
      case "tc":
        setTcComplete(true);
        break;
      default:
        break;
    }
  };

  const handlePrev = () => {
    switch (key) {
      case "course":
        setKey("pii");
        setCourseComplete(false);
        setPiiComplete(true);
        break;
      case "tc":
        setKey("course");
        setCourseComplete(true);
        setTcComplete(false);
        break;
      default:
        break;
    }
  };

  const handleSubmitPii = (event) => {
    event.preventDefault();
    handleNext();
  };

  const handleSubmitCourse = (event) => {
    event.preventDefault();
    handleNext();
  };

  const handleSubmitTc = (event) => {
    event.preventDefault();
    handleNext();
    console.log(data);
  };

  const handleChange = (event) => {
    setData({ ...data, pii_file: event.target.value });
    console.log(data);
  };

  const handleChangeAgree = (event) => {
    setData({ ...data, agree: event.target.checked });
    console.log(data);
  };

  const VideoPlayer = ({ courseUrl }) => {
    return (
      <div className="embed-responsive embed-responsive-16by9">
        <iframe
          src={`https://www.youtube.com/embed/${courseUrl}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  };

  return (
    <div className="volunteer-container">
      <div>
        <header className="App-header">
          <h1>New Volunteer Registration</h1>
        </header>
        <div className="container">
          <div className="tabbed-wizard">
            <Tabs
              activeKey={key}
              onSelect={(k) => setKey(k)}
              transition={false}
              id="tab-wizard"
            >
              <Tab
                eventKey="pii"
                title="Personal information"
                disabled={!piiComplete}
              >
                <Form onSubmit={handleSubmitPii}>
                  <Form.Group controlId="piiForm">
                    <Form.Label>Upload document: </Form.Label>
                    <Form.Control
                      type="file"
                      name="pii_file"
                      value={pii_file}
                      onChange={(e) => handleChange(e)}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Next
                  </Button>
                </Form>
              </Tab>
              <Tab
                eventKey="course"
                title="Saayam volunteer course"
                disabled={!courseComplete}
              >
                <Form onSubmit={handleSubmitCourse}>
                  <Form.Group controlId="courseForm">
                    <VideoPlayer courseUrl={courseUrl} />
                  </Form.Group>
                  <Button variant="secondary" onClick={handlePrev}>
                    Previous
                  </Button>{" "}
                  <Button variant="primary" type="submit">
                    Next
                  </Button>
                </Form>
              </Tab>
              <Tab
                eventKey="tc"
                title="Terms & Conditions"
                disabled={!tcComplete}
              >
                <Form onSubmit={handleSubmitTc}>
                  <Form.Group controlId="tcForm">
                    <div className="mb-3">
                      <Form.Check
                        type="checkbox"
                        id="agree"
                        label="Read and agree the Terms & Conditions"
                        onChange={(e) => handleChangeAgree(e)}
                      />
                    </div>
                  </Form.Group>
                  <Button variant="secondary" onClick={handlePrev}>
                    Previous
                  </Button>{" "}
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerPage;
