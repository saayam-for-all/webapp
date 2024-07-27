const HelpRequestForm = () => {
  return (
    <div className="bg-gray-100">
      <div className="w-full max-w-3xl mx-auto p-8">
        <div className="bg-white p-8 rounded-lg shadow-md border">
          <h1 className="text-2xl font-bold text-gray-800 ">
            Create Help Request
          </h1>

          <div className="mt-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label for="first_name" className="block text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  className="w-full rounded-lg border py-2 px-3"
                />
              </div>
              <div>
                <label for="last_name" className="block text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  className="w-full rounded-lg border py-2 px-3 "
                />
              </div>
            </div>

            <div className="mt-3">
              <label for="email" className="block text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full rounded-lg border py-2 px-3"
              />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <label for="phone" className="block text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  className="w-full rounded-lg border py-2 px-3"
                />
              </div>
              <div>
                <label for="age" className="block text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  className="w-full rounded-lg border py-2 px-3 "
                />
              </div>
            </div>

            <div class="flex items-center mt-3 gap-2">
              <label for="calamity" className="block text-gray-700">
                Is calamity?
              </label>
              <input
                id="calamity"
                type="checkbox"
                value=""
                name="calamity"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
              />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-4">
              <div>
                <label
                  for="priority"
                  class="block mb-2 text-sm font-medium text-gray-900"
                >
                  Priority
                </label>
                <select
                  id="priority"
                  class="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                >
                  <option selected>Choose priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label
                  for="category"
                  class="block mb-2 text-sm font-medium text-gray-900"
                >
                  Request Category
                </label>
                <select
                  id="category"
                  class="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                >
                  <option selected>Choose category</option>
                  <option value="high">Category 1</option>
                  <option value="medium">Category 2</option>
                </select>
              </div>

              <div>
                <label
                  for="requestType"
                  class="block mb-2 text-sm font-medium text-gray-900"
                >
                  Request Type
                </label>
                <select
                  id="requestType"
                  class="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                >
                  <option selected>Choose request type</option>
                  <option value="inPlace">In Place</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
            </div>

            <div class="mt-3">
              <label
                for="description"
                class="block text-gray-700 font-medium mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                class="border border-gray-400 p-2 w-full rounded-lg"
                rows="5"
              ></textarea>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-2">
            <button className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg">
              Cancel
            </button>
            <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpRequestForm;
