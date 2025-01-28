import React, { useState } from "react";
import axios from "axios";

const HelpRequestForm = () => {
  const [formData, setFormData] = useState({
    category: "",
    requestType: "",
    isCalamity: false,
    priority: "",
    description: "",
    isForSelf: true,
    otherPerson: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      sex: "",
      age: "",
      languagePreferences: "",
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/help-requests", formData);
      console.log("Help request created:", response.data);
    } catch (error) {
      console.error("Error creating help request:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <header className="grid place-items-center ">
        <h1 className="px-8 py-8">Create Help request</h1>
        <br></br>
        <h2 className="px-8 py-8">warning</h2>
      </header>
      <br></br>
      <br></br>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div>
            <label>
              Is for Self:
              <input
                type="checkbox"
                name="isForSelf"
                checked={formData.isForSelf}
                onChange={(e) =>
                  setFormData({ ...formData, isForSelf: e.target.checked })
                }
              />
            </label>
          </div>

          {!formData.isForSelf && (
            <div>
              <label>
                First Name:
                <input
                  type="text"
                  name="otherPerson.firstName"
                  value={formData.otherPerson.firstName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      otherPerson: {
                        ...formData.otherPerson,
                        firstName: e.target.value,
                      },
                    })
                  }
                />
              </label>

              <label>
                Last Name:
                <input
                  type="text"
                  name="otherPerson.lastName"
                  value={formData.otherPerson.lastName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      otherPerson: {
                        ...formData.otherPerson,
                        lastName: e.target.value,
                      },
                    })
                  }
                />
              </label>

              <label>
                Phone Number:
                <input
                  type="text"
                  name="otherPerson.phoneNumber"
                  value={formData.otherPerson.phoneNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      otherPerson: {
                        ...formData.otherPerson,
                        phoneNumber: e.target.value,
                      },
                    })
                  }
                />
              </label>

              <label>
                Email:
                <input
                  type="email"
                  name="otherPerson.email"
                  value={formData.otherPerson.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      otherPerson: {
                        ...formData.otherPerson,
                        email: e.target.value,
                      },
                    })
                  }
                />
              </label>

              <label>
                Sex:
                <input
                  type="text"
                  name="otherPerson.sex"
                  value={formData.otherPerson.sex}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      otherPerson: {
                        ...formData.otherPerson,
                        sex: e.target.value,
                      },
                    })
                  }
                />
              </label>

              <label>
                Age:
                <input
                  type="number"
                  name="otherPerson.age"
                  value={formData.otherPerson.age}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      otherPerson: {
                        ...formData.otherPerson,
                        age: e.target.value,
                      },
                    })
                  }
                />
              </label>

              <label>
                Language Preferences:
                <input
                  type="text"
                  name="otherPerson.languagePreferences"
                  value={formData.otherPerson.languagePreferences}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      otherPerson: {
                        ...formData.otherPerson,
                        languagePreferences: e.target.value,
                      },
                    })
                  }
                />
              </label>
            </div>
          )}

          <label>
            Category:
            <select
              name="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="category1">Category 1</option>
              <option value="category2">Category 2</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            Request Type:
            <select
              name="requestType"
              value={formData.requestType}
              onChange={(e) =>
                setFormData({ ...formData, requestType: e.target.value })
              }
            >
              <option value="inPlace">In Place</option>
              <option value="remote">Remote</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            Is Calamity:
            <input
              type="checkbox"
              name="isCalamity"
              checked={formData.isCalamity}
              onChange={(e) =>
                setFormData({ ...formData, isCalamity: e.target.checked })
              }
            />
          </label>
        </div>

        <div>
          <label>
            Priority:
            <select
              name="priority"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
            >
              <option value="select">select</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </label>
        </div>
      </div>
      <div className="grid ">
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default HelpRequestForm;
