import React, { useEffect } from "react"; //added for testing
import api from "../../../services/api";
// Example JSON data with multiple levels of subCategories - need to get this data from server
const categoriesData = {
  categories: [
    {
      category: "Banking",
      subCategories: [
        {
          category: "Retail Banking",
          subCategories: [
            {
              category: "Accounts",
              subCategories: [
                {
                  category: "Savings Account",
                  subCategories: ["Personal Savings", "Business Savings"],
                },
                {
                  category: "Checking Account",
                  subCategories: ["Personal Checking", "Business Checking"],
                },
              ],
            },
            {
              category: "Loans",
              subCategories: [
                {
                  category: "Personal Loans",
                  subCategories: ["Secured Loan", "Unsecured Loan"],
                },
                {
                  category: "Business Loans",
                  subCategories: ["Short-term Loan", "Long-term Loan"],
                },
              ],
            },
          ],
        },
        {
          category: "Investment Banking",
          subCategories: [
            {
              category: "Corporate Finance",
              subCategories: [
                {
                  category: "Mergers & Acquisitions",
                  subCategories: ["Advisory", "Execution"],
                },
                {
                  category: "Equity Capital Markets",
                  subCategories: [
                    "Initial Public Offering",
                    "Follow-on Offerings",
                  ],
                },
              ],
            },
            {
              category: "Sales & Trading",
              subCategories: ["Equities", "Fixed Income"],
            },
          ],
        },
      ],
    },
    "Books",
    "Clothes",
    "College Admissions",
    "Cooking",
    {
      category: "Education",
      subCategories: [
        "Elementary",
        "Middle School",
        "High School",
        "University",
      ],
    },
    "Employment",
    "Finance",
    "Food",
    "Gardening",
    "Homelessness",
    "Housing",
    "Jobs",
    "Investing",
    "Matrimonial",
    {
      category: "Medical",
      subCategories: ["Brain", "Depression", "Eye", "Hand", "Head", "Leg"],
    },
    "Rental",
    "School",
    "Shopping",
    {
      category: "Sports",
      subCategories: [
        "Baseball",
        "Basketball",
        "Cricket",
        "Handball",
        "Jogging",
        "Hockey",
        "Running",
        "Tennis",
      ],
    },
    "Stocks",
    "Travel",
    "Tourism",
  ],
};

const Skills = ({ checkedCategories, setCheckedCategories }) => {
  const fetchSkills = async () => {
    try {
      const response = await api.get("/volunteer-promotion-wizard/skills");
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Recursive function to handle rendering categories and subcategories
  const renderCategories = (categories, parentPath = "") => {
    return categories.map((cat, index) => {
      const isObject = typeof cat === "object";
      const categoryName = isObject ? cat.category : cat;
      const hasSubCategories = isObject && cat.subCategories;

      // Create a unique path for each category, concatenating parent path and current category name
      const currentPath = parentPath
        ? `${parentPath}.${categoryName}`
        : categoryName;

      return (
        <div key={index} className="ml-4">
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={getCheckedStatus(currentPath)}
              onChange={() => handleCheckboxChange(currentPath)}
            />
            <span className={getCheckedStatus(currentPath) ? "font-bold" : ""}>
              {categoryName}
            </span>
          </label>

          {/* Recursively render subcategories if they exist */}
          {hasSubCategories && getCheckedStatus(currentPath) && (
            <div className="ml-3">
              {renderCategories(cat.subCategories, currentPath)}
            </div>
          )}
        </div>
      );
    });
  };

  // Function to handle the checkbox click
  const handleCheckboxChange = (categoryPath) => {
    setCheckedCategories((draft) => {
      const checkedStatus = getCheckedStatus(categoryPath);

      // Toggle the current category checkbox state
      setCheckboxState(draft, categoryPath, !checkedStatus);
    });
  };

  // Get the checked status of a category by its hierarchical path
  const getCheckedStatus = (categoryPath) => {
    const keys = categoryPath.split(".");
    let currentLevel = checkedCategories;

    for (let key of keys) {
      if (!currentLevel[key]) return false;
      currentLevel = currentLevel[key];
    }

    return currentLevel.checked;
  };

  // Set the checkbox state for a category at a given path using immer's draft
  const setCheckboxState = (draft, categoryPath, checked) => {
    const keys = categoryPath.split(".");
    let currentLevel = draft;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        if (checked) {
          // If the checkbox is checked, set it to true
          currentLevel[key] = { checked: true };
        } else {
          // If unchecked, remove the key entirely
          delete currentLevel[key];
        }
      } else {
        if (!currentLevel[key]) {
          currentLevel[key] = {};
        }
        currentLevel = currentLevel[key];
      }
    });
  };

  return (
    <>
      <p className="font-bold text-xl mb-4">
        Select Your Skills For Volunteer Assignments
      </p>
      {renderCategories(categoriesData.categories)}
    </>
  );
};

export default Skills;
