import { useNavigate } from "react-router-dom";

const Thanks = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center m-5 p-5">
      <h1 className="text-4xl font-bold px-5">Thanks!</h1>
      <div className="flex flex-wrap items-center gap-2 m-4 justify-center items-center">
        <span className="text-xl">
          The email was sent successfully. Return back
        </span>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default Thanks;
