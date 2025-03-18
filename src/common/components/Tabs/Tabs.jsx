import { useState } from "react";

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(children[0].props.label);

  const handleClick = (e, newActiveTab) => {
    setActiveTab(newActiveTab);
  };

  return (
    <div>
      <div className="flex">
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
          <ul className="flex flex-wrap -mb-px">
            {children.map((child) => (
              <li
                key={child.props.label}
                className={`${
                  activeTab === child.props.label
                    ? "text-blue-600 border-blue-600"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300"
                } inline-block p-4 border-b-2 rounded-t-lg hover:cursor-pointer  me-2`}
                onClick={(e) => handleClick(e, child.props.label)}
              >
                {child.props.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        {children.map((child) => {
          if (child.props.label === activeTab) {
            return (
              <div key={child.props.label} className="mt-4">
                {child.props.children}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

const Tab = ({ children }) => <React.Fragment>{children}</React.Fragment>;

export { Tabs, Tab };
