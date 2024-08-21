import CommentsSection from "./CommentsSection";
import RequestDescription from "./RequestDescription";
import RequestDetailsSidebar from "./RequestDetailsSidebar";

const RequestDetails = () => {
  return (
    <div className="m-8 grid grid-cols-10 gap-4">
      <div className="col-span-7">
        <RequestDescription />
        <CommentsSection />
      </div>
      <div className="col-span-3">
        <RequestDetailsSidebar />
      </div>
    </div>
  );
};

export default RequestDetails;
