import avatar from "../../assets/avatar.jpg";

const RequestDescription = () => {
  return (
    <div className="rounded-lg bg-white p-6 text-surface">
      <div className="flex items-center mb-6">
        <img
          src={avatar}
          alt="Avatar"
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <div className="text-lg font-medium text-gray-800">Peter Parker</div>
          <div className="text-gray-500">2 days ago</div>
        </div>
      </div>
      <div className="flex gap-2 items-center justify-start">
        <h2 className="text-2xl font-semibold">
          Help Needed for Community Clean-Up Event
        </h2>
        <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
          Open
        </span>
      </div>
      <ul className="flex flex-wrap gap-2 text-xs text-gray-500">
        <li>#12345</li>
        <li>Created July 1, 2024</li>
        <li>Last Updated 2 hours ago</li>
      </ul>

      <h4 className="mt-4 text-base font-semibold">Description</h4>
      <p className="text-sm">
        We need volunteers for our upcoming Community Clean-Up Day on August 15
        from 9:00 AM to 1:00 PM at Cherry Creek Park. Tasks include picking up
        litter, sorting recyclables, and managing the registration table. We
        also need donations of trash bags, gloves, and refreshments. Your
        support will help make our community cleaner and more enjoyable for
        everyone.
      </p>
    </div>
  );
};

export default RequestDescription;
