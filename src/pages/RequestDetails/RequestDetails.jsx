import { Tab, Tabs } from "../../common/components/Tabs/Tabs";
import Comments from "./Comments";
import CommentsSection from "./CommentsSection";
import RequestDescription from "./RequestDescription";

const RequestDetails = () => {
  return (
    <div className="m-8">
      <Tabs>
        <Tab label="Description">
          <RequestDescription />
        </Tab>
        <Tab label="Comments">
          <CommentsSection />
        </Tab>
        <Tab label="Assignee">
          <div>Assignee</div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default RequestDetails;
